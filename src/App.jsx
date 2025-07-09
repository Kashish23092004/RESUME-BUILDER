// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeaderBar from './Components/HeaderBar';
import UploadResume from './Components/UploadResume';
import ManualEdit from './pages/AIEnhance';
import AIEnhance from './Components/ManualEdit';

const App = () => {
  return (
    <>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<UploadResume />} />
        <Route path="/manual-edit" element={<ManualEdit />} />
        <Route path="/ai" element={<AIEnhance />} />
      </Routes>
    </>
  );
};

export default App;