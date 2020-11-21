import React from 'react';
import Message from '../models/Message';
import EmotionRanking from '../models/EmotionRanking';

interface Props{
  analysis:EmotionRanking[]
}
const MessageRankingAnalysis:React.FC<Props> = (props:Props) => {
  const renderMessage = (message : Message, score : number) => (
    <li>
      {message.sender_name}
      {' '}
      :
      {message.content}
      {' '}
      (score :
      {' '}
      {score}
      )
    </li>
  );
  const renderEmotion = (emotionRanking : EmotionRanking) => (
    <li>
      <div>
        {emotionRanking.reaction}
      </div>
      <ol>
        {emotionRanking.best_messages.map((e) => renderMessage(e.message, e.score))}
      </ol>
    </li>
  );
  return (
    <p>
      COUCOU
      {' '}
      {props.analysis.map((ana) => ana.reaction)}
      <ol>
        {props.analysis.map(renderEmotion)}
      </ol>
    </p>
  );
};

export default MessageRankingAnalysis;
