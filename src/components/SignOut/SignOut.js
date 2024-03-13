// SignOut.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import './SignOut.css';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();

      // Remove token from localStorage
      localStorage.clear();

      // Redirect to the Sign In page upon successful sign-out
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="signout-container">
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;