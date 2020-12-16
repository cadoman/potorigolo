import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import FrontAPI from '../FrontAPI';
import MyLinearProgress from './MyLinearProgress';
import TutorialExtract from './TutorialExtract';

const FullScreenCenterContent = styled.div`
  width: 100vw;
  height : 100vh;
  display: flex;
  flex-direction : column;
  justify-content : center;
  align-items : center;
  > *{
    margin : 5px 10%;
  }
`;

interface Props {
  onSummaryGenerated: () => void
}
const ExtractZip: React.FC<Props> = (props: Props) => {
  const [progress, setProgress] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractionError, setExtractionError] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const startSummaryAnalysis = () => {
    const task = FrontAPI.buildSummary();
    setAnalyzing(true);
    task.on('done', props.onSummaryGenerated);
  };
  const extractZip = () => {
    const task = FrontAPI.promptChooseZip();
    task.on('progress', (p) => {
      setExtracting(true);
      setShowTutorial(false);
      setProgress(p);
    });
    task.on('done', () => {
      setExtracting(false);
      startSummaryAnalysis();
    });
    task.on('error', (error) => { setExtractionError(error); console.error(error); });
  };

  return (
    <>
      { !extracting && !analyzing && !extractionError && (
        <>
          {!showTutorial ? (
            <FullScreenCenterContent>
              <Button color="primary" variant="contained" onClick={extractZip}>
                Importer l&apos;archive facebook
              </Button>
              <Button color="primary" size="small" onClick={() => setShowTutorial(true)}>Tu n&apos;as pas ton archive facebook?</Button>
            </FullScreenCenterContent>
          ) : (
            <TutorialExtract onSelectZip={extractZip} />
          )}
        </>
      )}

      {
        (extracting || analyzing)
        && (
          <FullScreenCenterContent>
            <MyLinearProgress style={{ width: 400 }} progress={progress} />
            {
                extracting
                  ? (
                    <p>
                      Extraction des messages
                    </p>
                  ) : (
                    <p>Analyse des conversations en cours ...</p>
                  )
            }
          </FullScreenCenterContent>
        )
      }
      {
        extractionError && (
          <FullScreenCenterContent>
            <p> Erreur lors de l&apos;extraction</p>
          </FullScreenCenterContent>
        )
      }
    </>
  );
};

export default ExtractZip;
