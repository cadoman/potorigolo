import MessageModel from './MessageModel';

interface EmotionRanking{
  reaction : string;
  best_messages : {
    message : MessageModel,
    score : number
  }[]
}

export default EmotionRanking;
