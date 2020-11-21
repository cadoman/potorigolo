import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EmotionRanking from '../models/EmotionRanking';
import FrontAPI from '../FrontAPI';
import ConversationSummary from '../models/ConversationSummary';
import MessageRankingAnalysis from './MessageRankingAnalysis';

interface Props{
  conversation : ConversationSummary
}

const RightPanel = styled.div`
  width: 70%;
  margin: 0;
  display: inline-block;
`;

const ConversationDetails : React.FC<Props> = (props : Props) => {
  const [messageRankingAnalysis, setMessageRankingAnalysis] = useState<EmotionRanking[]>(undefined);

  const fetchAnalysis = () => {
    console.log('fetching ', props.conversation.id);
    FrontAPI.getMessageRankingEmotion(props.conversation.id)
      .then((analysis) => {
        console.log('found analysis', analysis);
        setMessageRankingAnalysis(analysis);
      })
      .catch(() => setMessageRankingAnalysis(undefined));
  };

  useEffect(fetchAnalysis, [props.conversation]);

  const doAnalysis = () => {
    const task = FrontAPI.analyzeConversationEmotions(props.conversation.id);
    task.on('done', () => {
      fetchAnalysis();
    });
  };
  return (
    <RightPanel>
      <h2>
        { props.conversation.title}
      </h2>
      <h3>
        {props.conversation.message_count}
        {' '}
        Messages depuis le
        {' '}
        {new Date(props.conversation.first_message.timestamp_ms).toLocaleDateString('FR-fr', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </h3>
      <p>{props.conversation.last_message.content}</p>
      {messageRankingAnalysis
        ? <MessageRankingAnalysis analysis={messageRankingAnalysis} />
        : <button type="button" onClick={doAnalysis}>Do analysis</button>}
    </RightPanel>
  );
};

export default ConversationDetails;
