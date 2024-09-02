import React from 'react'

function NotFound() {
  return (
    <div className='error-body'>
      <div className="error-container">
        <h1 className="error-title">404</h1>
        <p className="error-text">Oops! It seems like you are lost... <span className="animate-blink">????</span></p>
      </div>
    </div>
  )
}

export default NotFound