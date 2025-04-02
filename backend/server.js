const express = require('express');
const cors = require('cors'); // cors is a middleware that allows the client to make requests to the server from a different domain
const {connect} = require('mongoose'); // connect is a function that connects to the MongoDB database
require('dotenv').config(); // dotenv is a package that loads environment variables from a .env file into process.env

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const {notFound, errorHandler} = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json({extended: true})); // express.json() is a middleware that parses incoming requests with JSON payloads
app.use(express.urlencoded({extended: true})); // express.urlencoded() is a middleware that parses incoming requests with urlencoded payloads
app.use(cors({credentials: true, origin: 'http://13.60.43.234:3000'})); // cors() is a middleware that enables cross-origin resource sharing

app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);

app.use(notFound)
app.use(errorHandler)

connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(5000,'0.0.0.0', () => console.log(`Server is running on port ${process.env.PORT || 5000}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });