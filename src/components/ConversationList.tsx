import React from 'react';
import styled from 'styled-components';
import ConversationSummary from '../models/ConversationSummary';

interface Props{
  conversationSummaries : ConversationSummary[]
  onConversationSelected : (selected : ConversationSummary) => void
}

const StyledOl = styled.ol`
  width : 30%;
  padding: 0;
  max-height: 100vh;
  overflow-y: scroll;
`;

const StyledConvButton = styled.button`
  background-color: white;
  display: block;
  outline: none;
  border: none;
  font-size: 1.5em;
  width: 100%;
  padding-left: 5px;
  text-align: left;
  :hover{
    cursor: pointer;
    background-color: gray;
  }
`;

const ConversationList: React.FC<Props> = (props : Props) => {
  const renderSummary = (summary : ConversationSummary) => (
    <StyledConvButton type="button" key={summary.id} onClick={() => props.onConversationSelected(summary)}>
      <p>
        {summary.title}
      </p>
    </StyledConvButton>
  );

  return (
    <StyledOl>
      {props.conversationSummaries.map(renderSummary)}
    </StyledOl>
  );
};
export default ConversationList;
