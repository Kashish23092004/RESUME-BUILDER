// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeaderBar from './Components/HeaderBar';
import UploadResume from './Components/UploadResume';
import ManualEdit from './pages/ManualEdit'; // import your new component
import AIEnhance from './Components/AIEnhance';

const App = () => {
  return (
    <>
    <HeaderBar />
    <Routes>
      <Route path="/" element={<UploadResume />} />
      <Route path="/manual-edit" element={<ManualEdit />} />
      <Route path="/ai" element={<AIEnhance/>} />
    </Routes>
    </>
  );
};

export default App;