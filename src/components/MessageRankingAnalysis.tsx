import React from 'react';
import EmotionRanking from '../models/EmotionRanking';
import MessageDisplay from './MessageDisplay';

interface Props{
  analysis:EmotionRanking[];
  conversationID : string;
}
const MessageRankingAnalysis:React.FC<Props> = (props:Props) => {
  const renderEmotion = (emotionRanking : EmotionRanking) => (
    <div key={emotionRanking.reaction}>
      <div>
        {emotionRanking.reaction}
      </div>
      <div>
        {emotionRanking.best_messages.map((e) => (
          <MessageDisplay
            key={e.message.timestamp_ms}
            message={e.message}
            conversationID={props.conversationID}
          />
        ))}
      </div>
    </div>
  );
  return (
    <>
      {props.analysis.map(renderEmotion)}
    </>
  );
};

export default MessageRankingAnalysis;
