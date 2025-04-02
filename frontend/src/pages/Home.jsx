import React from 'react'
import Expenses from './Expenses'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Elevate Daily</h1>
          <p className="text-blue-100">Manage your daily expenses</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <Expenses />
      </main>
    </div>
  )
}

export default Home