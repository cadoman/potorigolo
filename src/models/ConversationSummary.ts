import Message from './Message';

interface ConversationSummary {
  title: string;
  last_update: string;
  message_count: number;
  id: string;
  last_message: Message;
  first_message : Message;

}
export default ConversationSummary;
