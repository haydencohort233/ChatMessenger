// SignIn.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setError('');

      const userCredential = await auth.signInWithEmailAndPassword(email, password);

      // Check if the user authentication is successful
      if (userCredential.user) {
        const user = userCredential.user;
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Use the navigate function to redirect to the Home page upon successful sign-in
        navigate('/home');
      } else {
        setError('Authentication failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError('Authentication failed. Please check your email and password.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Sign In</h2>
        <form>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="button" onClick={handleSignIn}>
            Sign In
          </button>
        </form>
        <p>
          New user? <Link to="/signup">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
