import React from 'react';
import styled from 'styled-components';
import ConversationSummary from '../models/ConversationSummary';

interface Props{
  conversationSummaries : ConversationSummary[]
  onConversationSelected : (selected : ConversationSummary) => void
}

const StyledOl = styled.ol`
  padding: 0;
  margin: 30px auto;
  box-shadow: 3px -2px 5px 3px #ccc;
`;

const StyledConvButton = styled.button`
  background-color: white;
  display: block;
  outline: none;
  border: none;
  font-size: 1.5em;
  width: 100%;
  padding: 0px 30px;
  text-align: left;
  transition : background-color .2s;
  :hover{
    cursor: pointer;
    background-color: #DDDDDD;
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

  const conversationMatters = (summary : ConversationSummary) : boolean => summary.participants.length > 2 && summary.message_count > 200;
  const guessAuthor = (summary : ConversationSummary[]) => {
    const part = summary.map((conv) => conv.participants.map((p) => p.name));
    let potentialAuthors = part[0];
    let i = 1;
    while (potentialAuthors.length > 1) {
      const nextAuthors = part[i];
      potentialAuthors = potentialAuthors.filter((author) => nextAuthors.indexOf(author) !== -1);
      i += 1;
    }
    return potentialAuthors[0];
  };
  localStorage.setItem('author', guessAuthor(props.conversationSummaries));
  return (
    <StyledOl>
      {props.conversationSummaries.filter(conversationMatters).map(renderSummary)}
    </StyledOl>
  );
};
export default ConversationList;
