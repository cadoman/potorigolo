import React from 'react';
import styled from 'styled-components';
import RankedMessage from '../models/RankedMessage';
import MessageDisplay from './MessageDisplay';

interface Props {
  mainMessage : RankedMessage;
  conversationID: string;
}

const TimeIndication = styled.p`
  color : gray;
  text-align: center;
`;
const MessageRankingAnalysis: React.FC<Props> = ({ mainMessage, conversationID }: Props) => {
  const renderContext = (ranked: RankedMessage) => ranked.context.map((message, index) => (
    <MessageDisplay
      key={message.timestamp_ms}
      message={message}
      conversationID={conversationID}
      stickWithPrevious={index > 0 && ranked.context[index - 1].sender_name === message.sender_name}
    />
  ));

  return (
    <div key={mainMessage.message.timestamp_ms}>
      <TimeIndication>
        {new Date(mainMessage.message.timestamp_ms).toLocaleDateString('fr')}
      </TimeIndication>
      <>
        {renderContext(mainMessage)}
      </>
    </div>
  );
};

export default MessageRankingAnalysis;
