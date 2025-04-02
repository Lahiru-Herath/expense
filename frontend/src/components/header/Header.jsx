import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/log01.png';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);

  useEffect(() => {
    const handleResize = () => {
      setIsNavShowing(window.innerWidth > 800);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleNavHandler = () => {
    setIsNavShowing((prevState) => !prevState);
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo">
          <img src={Logo} alt="logo" />
        </Link>
        <ul className={`nav__menu ${isNavShowing ? 'show' : ''}`}>
          <li>
            <Link to="/profile/sdfsdf" onClick={() => setIsNavShowing(false)}>
              Ernest Achiever
            </Link>
          </li>
          <li>
            <Link to="/create" onClick={() => setIsNavShowing(false)}>
              Create Post
            </Link>
          </li>
          <li>
            <Link to="/authors" onClick={() => setIsNavShowing(false)}>
              Authors
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setIsNavShowing(false)}>
              Sign In
            </Link>
          </li>
        </ul>
        <button className="nav__toggle-btn" onClick={toggleNavHandler}>
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
