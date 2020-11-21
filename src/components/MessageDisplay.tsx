import { NativeImage } from 'electron';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FrontAPI from '../FrontAPI';
import MessageModel from '../models/MessageModel';

const getPictureID = (uri: string): string => {
  const path = uri.substr(0, uri.search(/\.jpg|\.png/)).split('/');
  return path[path.length - 1];
};

const StyledMessage = styled.div`
    display : inline-block;
    max-width: 300px;
`;
const StyledImage = styled.img`
    display : block;
    width: 100%;
`;

interface Props {
  message: MessageModel;
  conversationID : string
}
const MessageDisplay: React.FC<Props> = (props: Props) => {
  const [picture, setPicture] = useState<NativeImage>(undefined);
  useEffect(() => {
    if (props.message.photos) {
      FrontAPI.getPicture(getPictureID(props.message.photos[0].uri), props.conversationID).then(
        (p) => setPicture(p),
      );
    }
  }, [props.message, props.conversationID]);
  return (

    <StyledMessage>
      {
                !!props.message.content
                  && props.message.content
            }
      {
                picture
                && (
                <StyledImage
                  src={picture.toDataURL()}
                  alt=""
                />
                )
            }
    </StyledMessage>
  );
};
export default MessageDisplay;
