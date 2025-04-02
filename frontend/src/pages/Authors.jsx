import React, {useState} from 'react'
import {Link} from 'react-router-dom'

import Avatar01 from '../assets/images/avatar01.png'
import Avatar02 from '../assets/images/avatar02.png'
import Avatar05 from '../assets/images/avatar05.png'
import Avatar06 from '../assets/images/avatar06.png'
import Avatar07 from '../assets/images/avatar07.png'

const authorsData = [
  {id: 1, avatar: Avatar01, name: 'John Doe', posts:3},
  {id: 2, avatar: Avatar02, name: 'Will Young', posts:5},
  {id: 3, avatar: Avatar05, name: 'John Smith', posts:0},
  {id: 4, avatar: Avatar06, name: 'Jane Carter', posts:3},
  {id: 5, avatar: Avatar07, name: 'Ray Johnson', posts:6}
]

const Authors = () => {
  const [authors, setAuthors] = useState(authorsData)
  return (
    <section className="authors">
      {authors.length > 0
        ? <div className="container authors__container">
            {
              authors.map(({id, avatar, name, posts}) => {
                return (
                  <Link key={id} to={`/posts/users/${id}`} className="author">
                    <div className="author__avatar">
                      <img src={avatar} alt={`Image of ${name}`} />
                    </div>
                    <div className="author__info">
                      <h4>{name}</h4>
                      <p>{posts}</p>
                    </div>
                  </Link>
                );
              })
            }
          </div>

        : <h2 className='center'>No Authors Found</h2>
      }
    </section>
  )
}

export default Authors