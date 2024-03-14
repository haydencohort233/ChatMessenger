import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [error, setError] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);
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

  useEffect(() => {
    // Update display name in state when it changes in Firebase Auth
    if (user) {
      setNewDisplayName(user.displayName || '');
    }
  }, [user]);

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

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    // Update users photoURL in Firebase
    if (user) {
      const avatarPath = `/images/${avatar}.png`; // Avatars location
      user.updateProfile({
        photoURL: avatarPath,
      }).then(() => {
        console.log('Avatar updated successfully');
        setShowAvatarModal(false); // Close after selecting an avatar
      }).catch((error) => {
        console.error('Error updating avatar:', error.message);
        setError('Failed to update avatar. Please try again.');
      });
    }
  };

  const handleDisplayNameChange = () => {
    const newName = window.prompt('Enter your new display name:');
    if (newName !== null && newName !== '') {
      // Update user display name in Firebase
      if (user) {
        user.updateProfile({
          displayName: newName,
        }).then(() => {
          console.log('Display name updated successfully');
          setNewDisplayName(newName); // Update display name in state
          setShowDisplayNameModal(false); // Close after updating
        }).catch((error) => {
          console.error('Error updating display name:', error.message);
          setError('Failed to update display name. Please try again.');
        });
      }
    }
  };

  return (
    <div className="settings-container">
      <h2>User Information</h2>
      {loading ? (
        <p>Loading User Information...</p>
      ) : user ? (
        <div>
          <div className="user-info">
            <p>
              <strong>Avatar Photo:</strong> {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : 'N/A'}
              <button type="button" onClick={() => setShowAvatarModal(true)}>
              Change Avatar
            </button>
            </p>
            <p>
              <strong>Display Name:</strong> {user.displayName || 'N/A'}{' '}
              <button onClick={handleDisplayNameChange}>Change Display Name</button>
            </p>
            <p>
              <strong>Email Address:</strong> {user.email}
              <span className={user.emailVerified ? 'verified' : 'not-verified'}>
                {user.emailVerified ? 'Verified' : 'Not Verified'}
              </span>
            </p>
          </div>
          <hr />
          <div className="user-settings">
            <h2>User Settings</h2>
            <div className="password-update">
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
          </div>
          <div className="settings-buttons">
            <button className="delete-button" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button type="button" onClick={handleSignOut}>
              Sign Out
            </button>
            <button type="button"><Link to="/home">Back to Home</Link></button>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
      {/* Avatar selection modal */}
      {showAvatarModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Avatar</h2>
            <div className="avatar-selection">
              <button onClick={() => handleAvatarChange('avatar1')}>
                <img src="/images/avatar1.png" alt="Avatar 1" />
              </button>
              <button onClick={() => handleAvatarChange('avatar2')}>
                <img src="/images/avatar2.png" alt="Avatar 2" />
              </button>
              <button onClick={() => handleAvatarChange('avatar3')}>
                <img src="/images/avatar3.png" alt="Avatar 3" />
              </button>
            </div>
            <button className="cancel-button" onClick={() => setShowAvatarModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;