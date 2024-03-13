import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import SignOut from './components/SignOut/SignOut';
import Home from './pages/Home';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signout" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default App;