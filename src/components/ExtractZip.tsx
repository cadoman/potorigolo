import React, { useState } from 'react';
import FrontAPI from '../FrontAPI';
import TutorialExtract from './TutorialExtract';

interface Props {
  onSummaryGenerated: () => void
}
const ExtractZip: React.FC<Props> = (props: Props) => {
  const [progress, setProgress] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractionError, setExtractionError] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  const startSummaryAnalysis = () => {
    const task = FrontAPI.buildSummary();
    setAnalyzing(true);
    task.on('done', props.onSummaryGenerated);
  };
  const extractZip = () => {
    const task = FrontAPI.promptChooseZip();
    task.on('start', () => {
      setExtracting(true);
      setShowTutorial(false);
    });
    task.on('progress', (p) => setProgress(p));
    task.on('done', () => {
      setExtracting(false);
      startSummaryAnalysis();
    });
    task.on('error', (error) => { setExtractionError(error); console.error(error); });
  };

  return (
    <div>
      {
        !extracting && !analyzing && !extractionError && (
          <>
            {!showTutorial ? (
              <>
                <button type="button" onClick={extractZip}>
                  Importer l&apos;archive facebook
                </button>
                <button type="button" onClick={() => setShowTutorial(true)}>Tu n&apos;as pas ton archive facebook?</button>
              </>
            ) : (
              <TutorialExtract onSelectZip={extractZip} />
            )}
          </>
        )
      }

      {
        extracting
        && (
          <div style={{ width: '200px', height: '20px', border: '1px solid black' }}>
            <div style={{ width: `${progress * 2}px`, height: '20px', backgroundColor: 'orange' }} />
          </div>
        )
      }
      {
        analyzing
        && <p>Extraction terminée, analyse des conversations en cours ...</p>
      }
      {
        extractionError && <p> Erreur lors de l&apos;extraction</p>
      }
    </div>
  );
};

export default ExtractZip;
