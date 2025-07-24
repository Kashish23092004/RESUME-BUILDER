import React, { useState } from 'react';
import UploadResume from './Components/UploadResume';
import ManualEdit from './Components/ManualEdit';
import AIEnhance from './pages/AIEnhance';
import HeaderBar from './Components/HeaderBar';

const App = () => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const handleUploadSuccess = () => {
    setHasUploaded(true);
  };

  return (
    <div className="container mx-auto px-4">
          <HeaderBar/>
      <div className="my-8">

        <UploadResume onSuccess={handleUploadSuccess} />
      </div>

      {/* If uploaded, show the other components */}
      {hasUploaded && (
        <>
          <div className="my-8">
          </div>
          <div className="my-8">
          </div>
        </>
      )}
    </div>
  );
};

export default App;
