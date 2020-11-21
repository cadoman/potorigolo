const AnalysisIndex = {
  summaryFile: (userDataPath:string) => `${userDataPath}/analysis/summary.json`,
  emotionRanking: (userDataPath:string, conversationID:string) => `${userDataPath}/analysis/emotions_${conversationID}.json`,
};

export default AnalysisIndex;
