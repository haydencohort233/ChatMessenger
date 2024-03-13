// Settings.js

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you wish to delete your account? This cannot be reversed!'
    );

    if (isConfirmed && user) {
      try {
        await user.delete();
        localStorage.clear();
        console.log('Successfully deleted account');
        navigate('/signup');
      } catch (error) {
        console.error('Error deleting account:', error.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setError('');
  
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }
  
      if (user) {
        await user.updatePassword(newPassword);
        console.log('Password updated successfully');
  
        // Clear input fields
        setNewPassword('');
        setConfirmPassword('');
        window.alert('Password changed successfully!');

      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
      setError('Password update failed. Please check your information and try again.');
    }
  };
  

  return (
    <div className="settings-container">
      <h2>User Settings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p>
            <strong>Email Address:</strong> {user.email}
            <span className={user.emailVerified ? 'verified' : 'not-verified'}>
              {user.emailVerified ? 'Verified' : 'Not Verified'}
            </span>
          </p>
          <p>
            <strong>Display Name:</strong> {user.displayName || 'N/A'}
          </p>
          <p>
            <strong>Avatar Photo:</strong> {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : 'N/A'}
          </p>
          <div className="password-update">
            <h2>Change Password</h2>
            <label>
              <p>New Password:</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              <p>Confirm New Password:</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button type="button" onClick={handlePasswordUpdate}>
              Update Password
            </button>
          </div>
          <button type="button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
          <button type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default Settings;