import React, { useEffect, useState } from 'react';
import FrontAPI from '../FrontAPI';
import ConversationSummary from '../models/ConversationSummary';
import MessageRankingAnalysis from './MessageRankingAnalysis';
import RankedMessage from '../models/RankedMessage';
import { Stories, Story } from './Stories';
import RunningTaskEmitter from '../models/RunningTaskEmitter';

interface Props {
  conversation: ConversationSummary
  onStoriesEnd : () => void
}

const BestMoments: React.FC<Props> = ({ conversation, onStoriesEnd }: Props) => {
  const [messageRanking, setMessageRanking] = useState<RankedMessage[]>([]);
  const fetchAnalysis = () => Promise.all([FrontAPI.getMessageRankingEmotion(conversation.id),
    FrontAPI.getPictureMessageRankingEmotion(conversation.id)]).then(
    ([a, b]) => setMessageRanking(a.concat(b)),
  );

  const doAnalysis = () => new Promise<void>((resolve) => {
    RunningTaskEmitter.all([
      FrontAPI.rankTextByEmotion(conversation.id),
      FrontAPI.rankPicturesByEmotion(conversation.id),
    ]).on('done', () => resolve());
  });

  useEffect(() => {
    fetchAnalysis().catch(
      () => doAnalysis().then(fetchAnalysis),
    );
  }, [conversation]);
  return (
    <Stories onStoriesEnd={onStoriesEnd}>
      {messageRanking.map((message) => (
        <Story key={message.message.timestamp_ms} duration={5000 + (message.context.length - 1) * 1000}>
          <MessageRankingAnalysis
            mainMessage={message}
            conversationID={conversation.id}
          />
        </Story>
      ))}
    </Stories>
  );
};

export default BestMoments;
