import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LandingPage = () => {
  const history = useHistory();

  const handleLogin = () => {
    history.push('/home');
  };

  return (
    <div className='landing'>
      <h1>Landing Page</h1>
      <button type='button' onClick={handleLogin}>Login</button>
      <button type='button'>Sign Up</button>
    </div>
  )
};

export default LandingPage;