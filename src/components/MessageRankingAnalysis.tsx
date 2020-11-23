import React from 'react';
import styled from 'styled-components';
import RankedMessage from '../models/RankedMessage';
import MessageDisplay from './MessageDisplay';

interface Props {
  analysis: RankedMessage[];
  conversationID: string;
}

const MessagesContainer = styled.div`
  border-top: 2px dashed black;
  margin-top: 100px;
`;

const TimeIndication = styled.p`
  color : gray;
  text-align: center;
`;
const MessageRankingAnalysis: React.FC<Props> = (props: Props) => {
  const renderContext = (ranked: RankedMessage) => ranked.context.map((message, index) => (
    <MessageDisplay
      key={message.timestamp_ms}
      message={message}
      conversationID={props.conversationID}
      stickWithPrevious={index > 0 && ranked.context[index - 1].sender_name === message.sender_name}
    />
  ));

  return (
    <>
      {
          props.analysis.map((rankedMessage) => (
            <MessagesContainer key={rankedMessage.message.timestamp_ms}>
              <TimeIndication>
                {new Date(rankedMessage.message.timestamp_ms).toLocaleDateString('fr')}
              </TimeIndication>
              <>
                {renderContext(rankedMessage)}
              </>
            </MessagesContainer>
          ))
      }
    </>
  );
};

export default MessageRankingAnalysis;
