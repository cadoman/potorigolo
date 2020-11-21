import React, { useState } from 'react';
import FrontAPI from '../FrontAPI';

interface Props{
  onSummaryGenerated : () => void
}
const ExtractZip: React.FC<Props> = (props : Props) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [extractionError, setExtractionError] = useState(null);

  const startSummaryAnalysis = () => {
    const task = FrontAPI.buildSummary();
    task.on('done', props.onSummaryGenerated);
  };
  const extractZip = () => {
    // const task = FrontAPI.promptChooseZip();
    // task.on('progress', (p) => setProgress(p));
    // task.on('done', () => {
    //   setDone(true);
    startSummaryAnalysis();
    // });
    // task.on('error', (error) => { setExtractionError(error); console.error(error); });
  };

  return (
    <div>
      <button type="button" onClick={extractZip}>
        Importez votre archive facebook
      </button>
      {
        !!progress && !done
        && (
          <div style={{ width: '200px', height: '20px', border: '1px solid black' }}>
            <div style={{ width: `${progress * 2}px`, height: '20px', backgroundColor: 'orange' }} />
          </div>
        )
      }
      {
        done
        && <p>Extraction terminée</p>
      }
      {
        extractionError && <p> Erreur lors de l&apos;extraction</p>
      }
    </div>
  );
};

export default ExtractZip;
