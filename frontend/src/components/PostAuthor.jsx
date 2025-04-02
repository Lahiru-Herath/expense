import React from 'react'
import { Link } from 'react-router-dom'
import Avatar01 from '../assets/images/avatar01.png'

const PostAuthor = () => {
  return (
    <Link to={`/posts/users/sdfsdf`} className='post__author'>
      <div className="post__author-avatar">
        <img src={Avatar01} alt="author" />
      </div>
      <div className="post__author-details text-left">
        <h5>By: John Ribb</h5>
        <small>Just Now</small>
      </div>
    </Link>
  )
}

export default PostAuthor