import React, { useState } from 'react';
import FrontAPI from '../FrontAPI';

const ExtractZip: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const extractZip = () => {
    const task = FrontAPI.promptChooseZip();
    task.on('progress', (p) => setProgress(p));
  };

  return (
    <div>
      <button type="button" onClick={extractZip}>
        Importez votre archive facebook
      </button>
      <div style={{ width: '200px', height: '20px', border: '1px solid black' }}>
        <div style={{ width: `${progress * 2}px`, height: '20px', backgroundColor: 'orange' }} />
      </div>
    </div>
  );
};

export default ExtractZip;
