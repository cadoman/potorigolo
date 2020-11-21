const AnalysisIndex = {
  summaryFile: (userDataPath:string) => `${userDataPath}/analysis/summary.json`,
  emotionRankingForText: (userDataPath:string, conversationID:string) => `${userDataPath}/analysis/emotions_text_${conversationID}.json`,
  emotionRankingForPicture: (
    userDataPath:string, conversationID:string,
  ) => `${userDataPath}/analysis/emotions_pictures_${conversationID}.json`,
};

export default AnalysisIndex;
