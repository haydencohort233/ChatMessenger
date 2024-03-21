import React, { useState, useEffect } from 'react';
import { auth, storage } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [error, setError] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
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
    // Update display name without having to reload
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

  const handleAvatarChange = async (avatar) => {
    // Update users photoURL
    if (user) {
      if (avatar.startsWith('avatar')) {
        const avatarPath = `/images/${avatar}.png`; // Avatars location
        try {
          await user.updateProfile({ photoURL: avatarPath });
          console.log('Avatar updated successfully');
          setShowAvatarModal(false); // Close after selecting an avatar
        } catch (error) {
          console.error('Error updating avatar:', error.message);
          setError('Failed to update avatar. Please try again.');
        }
      } else {
        // Handle custom avatar selection
        const file = avatar;
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // File size limited to 5MB
        const reader = new FileReader();
  
        reader.onloadend = async () => {
          if (allowedTypes.includes(file.type) && file.size <= maxSize) {
            try {
              // Upload the file to Firebase Storage
              const storageRef = storage.ref(`avatars/${user.uid}/${file.name}`);
              await storageRef.put(file);
  
              // Get the download URL of the uploaded file
              const downloadURL = await storageRef.getDownloadURL();
  
              // Update user's photoURL with the download URL
              await user.updateProfile({ photoURL: downloadURL });
  
              console.log('Custom avatar updated successfully');
              setShowAvatarModal(false); // Close the modal
            } catch (error) {
              console.error('Error updating custom avatar:', error.message);
              setError('Failed to update custom avatar. Please try again.');
            }
          } else {
            setError('Invalid file type or size. Please choose a valid image file (JPEG/PNG) under 5MB.');
          }
        };
  
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleCustomAvatarChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const allowedTypes = ['image/jpeg', 'image/png']; // Allowed file types
    const maxSize = 5 * 1024 * 1024; // 5MB
    const reader = new FileReader();

    reader.onloadend = async () => {
      // Check if file type and size are valid
      if (allowedTypes.includes(file.type) && file.size <= maxSize) {
        try {
          // Upload the file to Firebase Storage
          const storageRef = storage.ref(`avatars/${user.uid}/${file.name}`);
          await storageRef.put(file);

          // Get the download URL of the uploaded file
          const downloadURL = await storageRef.getDownloadURL();

          // Update user's photoURL with the download URL
          await user.updateProfile({ photoURL: downloadURL });

          console.log('Custom avatar updated successfully');
          setShowAvatarModal(false); // Close the modal
        } catch (error) {
          console.error('Error updating custom avatar:', error.message);
          setError('Failed to update custom avatar. Please try again.');
        }
      } else {
        // Display error message if file type or size is invalid
        setError('Invalid file type or size. Please choose a valid image file (JPEG/PNG) under 5MB.');
      }
    };

    if (file) {
      reader.readAsDataURL(file);
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
              <strong>Avatar Photo:</strong> {user.photoURL ? <img src={user.photoURL} className="user-avatar" alt="Avatar" /> : 'N/A'}
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
                <img
                  src="/images/avatar1.png"
                  alt="Avatar 1"
                  width="256"
                  height="256"
                  onClick={() => handleAvatarChange('avatar1')}
                />
                <div className="avatar-overlay">Female Avatar</div>
                <img
                  src="/images/avatar2.png"
                  alt="Avatar 2"
                  width="256"
                  height="256"
                  onClick={() => handleAvatarChange('avatar2')}
                />
                <div className="avatar-overlay">Male Avatar</div>
                <label htmlFor="custom-avatar-input">
                  <img src="/images/avatarprev.png" alt="Browse" />
                  <div className="avatar-overlay">Upload Custom Avatar</div>
                  <input
                    id="custom-avatar-input"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleCustomAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <button className="cancel-button" onClick={() => setShowAvatarModal(false)}>Cancel</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Settings;
