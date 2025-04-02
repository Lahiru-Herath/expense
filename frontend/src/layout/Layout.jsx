import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/header/Header.jsx'
import Footer from '../components/footer/Footer.jsx'

const Layout = ({children}) => { 
  // children is the child components that will be rendered
  return (
    <>
      <Header />
        {/* Outlet is a special component that will render the child components */}
        <Outlet />
      <Footer />
    </>
  )
}

export default Layout