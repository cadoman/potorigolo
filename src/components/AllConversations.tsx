import React, { useState } from 'react';
import styled from 'styled-components';
import ConversationSummary from '../models/ConversationSummary';
import ConversationDetails from './ConversationDetails';
import ConversationList from './ConversationList';

interface Props{
  summaries : ConversationSummary[]
}
const RightP = styled.p`
  display: inline-block;
  width: 70%;
`;
const MainPanel = styled.div`
  display: flex;
`;

const AllConversations : React.FC<Props> = (props : Props) => {
  const [currentConversation, setCurrentConversation] = useState<ConversationSummary>(undefined);
  return (
    <MainPanel>
      <ConversationList
        conversationSummaries={props.summaries}
        onConversationSelected={(c) => setCurrentConversation(c)}
      />
      {
        currentConversation
          ? <ConversationDetails conversation={currentConversation} />
          : <RightP>Vos best conv</RightP>
      }
    </MainPanel>
  );
};

export default AllConversations;
