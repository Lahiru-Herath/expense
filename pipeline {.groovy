pipeline {
    agent any
    
    environment {
        CLIENT_IMAGE = "lahiruherath/expense-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "lahiruherath/expense-backend:${BUILD_NUMBER}"
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        DOCKER_HUB_CREDS = credentials('dockerhub-creds')
        EC2_IP = '' // Will be dynamically set from Terraform output
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/Lahiru-Herath/expense'
                }
            }
        }
        
        stage('Initialize Terraform') {
            steps {
                sh 'terraform init'
            }
        }
        
        stage('Create EC2 Instance with Terraform') {
            steps {
                script {
                    sh 'terraform apply -auto-approve'
                    EC2_IP = sh(script: 'terraform output -raw instance_public_ip', returnStdout: true).trim()
                    echo "EC2 Instance created with IP: ${EC2_IP}"
                }
            }
        }

        stage('Setup SSH Key') {
            steps {
                withCredentials([file(credentialsId: 'expense-key', variable: 'SSH_KEY_PATH')]) {
                    sh 'cp $SSH_KEY_PATH expense-key.pem'
                    sh 'chmod 400 expense-key.pem'
                }
            }
        }

        stage('Wait for EC2 to be Ready') {
            steps {
                script {
                    retry(10) {
                        sleep 30
                        sh "ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} 'echo EC2 ready'"
                    }
                }
            }
        }
        
        stage('Install Docker Compose') {
            steps {
                script {
                    // First verify we have the IP address
                    echo "EC2 IP Address: ${EC2_IP}"
                    if (EC2_IP.trim() == '') {
                        error "EC2_IP is empty. Make sure Terraform output is correctly captured."
                    }
                    
                    // Then install docker-compose on the EC2 instance
                    sh """
                        ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} '
                            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
                            sudo chmod +x /usr/local/bin/docker-compose
                            docker-compose --version
                        '
                    """
                }
            }
        }
        
        stage('Verify Docker Installation') {
            steps {
                sh """
                    ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} "
                        docker --version || echo \"Docker not installed\"
                    "
                """
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    dir('frontend') {
                        sh "docker build -t ${CLIENT_IMAGE} ."
                    }
                    
                    dir('backend') {
                        sh "docker build -t ${BACKEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    sh "docker push ${CLIENT_IMAGE}"
                    sh "docker push ${BACKEND_IMAGE}"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    // Create docker-compose.yml file directly on EC2
                    sh """
                        ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} "cat > docker-compose.yml << 'EOL'
version: '3'
services:
  frontend:
    image: \${CLIENT_IMAGE}
    container_name: frontend
    ports:
      - '3000:3000'
    depends_on:
      - backend
    restart: always

  backend:
    image: \${BACKEND_IMAGE}
    container_name: backend
    ports:
      - '5000:5000'
    restart: always
EOL"
                    """

                    // SSH into EC2 and deploy
                    sh """
                        ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} "
                            # Create the environment file
                            echo 'CLIENT_IMAGE=${CLIENT_IMAGE}' > .env
                            echo 'BACKEND_IMAGE=${BACKEND_IMAGE}' >> .env
                            
                            # Ensure docker-compose file exists
                            ls -la docker-compose.yml
                            
                            # Stop any running containers
                            docker-compose down || true
                            
                            # Pull the new images
                            docker pull ${CLIENT_IMAGE}
                            docker pull ${BACKEND_IMAGE}
                            
                            # Start containers with the new images
                            docker-compose up -d
                        "
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} "
                            sleep 30
                            docker ps
                            curl -I http://localhost:3000 || echo \"Frontend not responding\"
                            curl -I http://localhost:5000/api/health || echo \"Backend not responding\"
                        "
                    """
                }
            }
        }
    }
    
    post {
        failure {
            script {
                // Check if key still exists before trying to use it
                sh 'test -f expense-key.pem && ssh -o StrictHostKeyChecking=no -i expense-key.pem ec2-user@${EC2_IP} "docker-compose logs" || echo "Unable to retrieve logs"'
                echo 'Build or deployment failed. Please check the logs.'
            }
        }
        always {
            sh 'docker logout'
            // Clean up the copied key last
            sh 'rm -f expense-key.pem || echo "Key file already removed"'
        }
    }
}