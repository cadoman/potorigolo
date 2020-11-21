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
  const [textMessageRankingAnalysis, setTextMessageRankingAnalysis] = useState<EmotionRanking[]>(undefined);
  const [pictureMessageRanking, setPictureMessageRanking] = useState<EmotionRanking[]>(undefined);
  const fetchAnalysis = () => {
    FrontAPI.getMessageRankingEmotion(props.conversation.id)
      .then((analysis) => {
        setTextMessageRankingAnalysis(analysis);
      })
      .catch(() => setTextMessageRankingAnalysis(undefined));
    FrontAPI.getPictureMessageRankingEmotion(props.conversation.id)
      .then((analysis) => {
        setPictureMessageRanking(analysis);
      })
      .catch(() => setPictureMessageRanking(undefined));
  };

  useEffect(fetchAnalysis, [props.conversation]);

  const doAnalysis = () => {
    let firstTaskDone = false;
    const fetchIfLast = () => {
      if (firstTaskDone) {
        fetchAnalysis();
      } else {
        firstTaskDone = true;
      }
    };
    const textTask = FrontAPI.rankTextByEmotion(props.conversation.id);
    const pictureTask = FrontAPI.rankPicturesByEmotion(props.conversation.id);
    textTask.on('done', fetchIfLast);
    pictureTask.on('done', fetchIfLast);
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
      <h2>Text Message ranking</h2>
      {textMessageRankingAnalysis
        ? <MessageRankingAnalysis conversationID={props.conversation.id} analysis={textMessageRankingAnalysis} />
        : <button type="button" onClick={doAnalysis}>Do analysis</button>}
      <h2>Pictures ranking</h2>
      {pictureMessageRanking
        ? <MessageRankingAnalysis conversationID={props.conversation.id} analysis={pictureMessageRanking} />
        : <button type="button" onClick={doAnalysis}>Do analysis</button>}
    </RightPanel>
  );
};

export default ConversationDetails;
