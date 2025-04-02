import React from 'react'
import {Link} from 'react-router-dom'
import PostAuthor from '../components/PostAuthor'
import Img01 from '../assets/images/img01.jpg'

const PostDetail = () => {
  return (
    <section className="post-details">
      <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor />
          <div className="post-detail__buttons">
            <Link to={`/posts/id/edit`} className='btn sm primary'>Edit</Link>
            <Link to={`/posts/id/delete`} className='btn sm danger'>Delete</Link>
          </div>
        </div>
        <h1 className='text-left'>This is the post title</h1>
        <div className="post-detail__thumbnail">
          <img src={Img01} alt="" />
        </div>
        <div>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse 
            voluptatibus nesciunt tempore, ab totam iste ea quae mollitia, error 
            consequatur enim, nisi iure sunt? Saepe id totam delectus incidunt vel, 
            asperiores dolor deleniti repellendus accusamus quisquam, tempora 
            placeat labore facilis.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse tempore 
            maiores autem cumque qui obcaecati minus perspiciatis alias architecto 
            illum! Ratione cupiditate veritatis earum quaerat corporis neque 
            adipisci explicabo, velit odit, officia eum? Repellendus voluptatum 
            illo suscipit, error omnis doloribus iure mollitia excepturi quibusdam 
            dolorum veniam aliquam quisquam a ipsum voluptas saepe, unde illum 
            impedit.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam 
            voluptate doloribus voluptatem, aliquid consequuntur quibusdam aliquam 
            at facere ea totam quam sit, nesciunt eligendi, recusandae voluptas. 
            Iste voluptate temporibus, omnis minus hic a minima officia voluptatum 
            numquam, suscipit provident et laborum quisquam ipsum, totam rerum 
            animi ut repellendus voluptas sit? Quia perferendis nesciunt 
            voluptates ab earum ducimus facilis maxime corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia 
            animi dolorum vitae impedit in? Optio nostrum quae earum asperiores 
            voluptatum.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PostDetail