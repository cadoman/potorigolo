import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ConversationSummary from '../models/ConversationSummary';
import BestMoments from './BestMoments';
import ConversationList from './ConversationList';

interface Props{
  summaries : ConversationSummary[]
}
const MainPanel = styled.div`
  display: flex;
`;

const AllConversations : React.FC<Props> = (props : Props) => {
  const [currentConversation, setCurrentConversation] = useState<ConversationSummary>(undefined);
  // useEffect(() => {
  //   if (props.summaries) {
  //     setCurrentConversation(props.summaries[0]);
  //   }
  // }, []);
  return (
    <MainPanel>
      {
        currentConversation
          ? <BestMoments onStoriesEnd={() => setCurrentConversation(undefined)} conversation={currentConversation} />
          : (
            <ConversationList
              conversationSummaries={props.summaries}
              onConversationSelected={(c) => setCurrentConversation(c)}
            />
          )
      }
    </MainPanel>
  );
};

export default AllConversations;
