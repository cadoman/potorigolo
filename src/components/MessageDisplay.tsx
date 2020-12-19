// import { NativeImage } from 'electron';
import React from 'react';
import styled from 'styled-components';
import MessageModel from '../models/MessageModel';

const getPictureID = (uri: string): string => {
  const path = uri.substr(0, uri.search(/\.jpg|\.png/)).split('/');
  return path[path.length - 1];
};

const TextContent = styled.p<{ authorIsMe: boolean }>`
  background-color: ${(props) => (props.authorIsMe ? 'rgb(0, 132, 255)' : '#f1f0f0')};
  color: ${(props) => (props.authorIsMe ? 'white' : 'black')};
  padding: 9px;
  width: fit-content;
  border-radius: 8px;
  margin: 0;
`;
const StyledImage = styled.img`
    display : block;
    border-radius: 8px;
    max-width: 100%;
    max-height: 500px;
`;

const MessageContainer = styled.div<{ stuckWithPrevious: boolean }>`
  max-width: 55%;
  width: fit-content;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: ${(props) => (props.stuckWithPrevious ? '4px' : '35px')};
`;
const AuthorName = styled.p`
  color: rgba(0, 0, 0, .40);
  font-size : 12px;
  margin: 0;
  padding-left: 9px;
`;

const ReactionPanel = styled.div`
  border: 1px solid gray;
  border-radius: 3px;
  float: right;
  font-size: 1.2em;

`;
const MessageRow = styled.div<{ authorIsMe: boolean }>`
  display: flex;
  flex-direction : column;
  align-items: ${(props) => (props.authorIsMe ? 'flex-end' : 'flex-start')};
`;

interface Props {
  message: MessageModel;
  conversationID: string;
  stickWithPrevious?: boolean;
}
const MessageDisplay: React.FC<Props> = ({ message, conversationID, stickWithPrevious }: Props) => {
  const authorIsMe = localStorage.getItem('author') === message.sender_name;
  const pictureID = message.photos ? getPictureID(message.photos[0].uri) : '';
  if (!message.content && !message.photos) {
    console.log('empty message : ', message);
  }
  return (
    <MessageRow authorIsMe={authorIsMe}>

      <MessageContainer stuckWithPrevious={stickWithPrevious}>
        {
          !stickWithPrevious && !authorIsMe
          && (
            <AuthorName>
              {message.sender_name}
            </AuthorName>
          )
        }
        {
          pictureID
          && (
            <StyledImage
              src={`http://localhost:1616/${conversationID}/${pictureID}`}
              alt=""
            />
          )
        }
        {
          !!message.content
          && (
            <TextContent authorIsMe={authorIsMe}>
              {message.content}
            </TextContent>
          )
        }
        {
          message.reactions
          && (
            <ReactionPanel>
              {message.reactions.map((e) => e.reaction).join(' ')}
            </ReactionPanel>
          )
        }
      </MessageContainer>
    </MessageRow>
  );
};
MessageDisplay.defaultProps = {
  stickWithPrevious: false,
};
export default MessageDisplay;
