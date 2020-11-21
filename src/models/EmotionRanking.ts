import Message from './Message';

interface EmotionRanking{
  reaction : string;
  best_messages : {
    message : Message,
    score : number
  }[]
}

export default EmotionRanking;
