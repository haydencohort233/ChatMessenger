import React, { useState } from 'react';
import { auth } from '../../firebase';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      setError('');
  
      if (password !== verifyPassword) {
        throw new Error("Passwords don't match");
      }
  
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
  
      // Check if the user authentication is successful
      if (user && user.uid) {

        const defaultAvatarURL = process.env.PUBLIC_URL + '/images/avatar1.png';
        await user.updateProfile({
          photoURL: defaultAvatarURL,
          displayName: username,
        });
  
        localStorage.setItem('userToken', user.uid);
        console.log('Successful sign up');
        navigate('/home');
      } else {
        setError('Sign-up failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError('Sign-up failed. Please check your information and try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form>
          <label>
            Username:
            <input 
                type="text" 
                placeholder='Username'
                value={username} 
                onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Email:
            <input 
                type="email" 
                placeholder='Email'
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password:
            <input 
                type="password" 
                placeholder='Password'
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label>
            Verify Password:
            <input
                type="password"
                placeholder='Verify Password'
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
        <p>
          Returning User? <Link to="/signin">Click here</Link> to sign in.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
