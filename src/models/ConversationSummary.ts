import MessageModel from './MessageModel';

interface ConversationSummary {
  title: string;
  last_update: string;
  message_count: number;
  id: string;
  last_message: MessageModel;
  first_message : MessageModel;
  participants : {
    name : string
  }[];
}
export default ConversationSummary;
