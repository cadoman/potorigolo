import MessageModel from './MessageModel';

interface RankedMessage {
  message: MessageModel;
  score: number;
  context : MessageModel[];
}

export default RankedMessage;
