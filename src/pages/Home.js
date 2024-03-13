// Home.js

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignOut from '../components/SignOut/SignOut';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user token and information are present in localStorage
    const userToken = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!userToken || !userString) {
      // If not present, redirect to the Sign In page
      localStorage.clear();
      navigate('/signin');
      console.error('User had missing data! Please sign in again.')
    }
  }, [navigate]);

  return (
    <div>
      {/* Your Home page content goes here */}
      <h1>Welcome to the Home Page!</h1>
      <SignOut />
      <button>
        <Link to="/settings">Settings</Link>
      </button>
    </div>
  );
};

export default Home;
