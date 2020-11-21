import { ipcRenderer } from 'electron';
import fs from 'fs';
import AnalysisIndex from './AnalysisIndex';
import IPCHandling from './IPCHandling';
import RunningTaskEmitter from './models/RunningTaskEmitter';
import ConversationSummary from './models/ConversationSummary';
import Tasks from './Tasks';
import EmotionRanking from './models/EmotionRanking';

const userDataPath = window.process.argv.slice(-1)[0];

class FrontAPI {
  public static getSummary(): Promise<ConversationSummary[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(AnalysisIndex.summaryFile(userDataPath), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  public static getMessageRankingEmotion(conversationID: string): Promise<EmotionRanking[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(AnalysisIndex.emotionRanking(userDataPath, conversationID), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  public static promptChooseZip(): RunningTaskEmitter {
    return FrontAPI.createTask(Tasks.promptChooseZip);
  }

  public static analyzeConversationEmotions(convID: string): RunningTaskEmitter {
    return FrontAPI.createTask(Tasks.rankMessageByEmotions, convID);
  }

  public static buildSummary(): RunningTaskEmitter {
    return FrontAPI.createTask(Tasks.buildSummary);
  }

  private static createTask(operationID: string, ...args: string[]): RunningTaskEmitter {
    const requestID = this.generateID();
    ipcRenderer.send(operationID, requestID, ...args);
    return IPCHandling.IPCToEmitter(requestID);
  }

  private static lastID = 1;

  private static generateID(): string {
    FrontAPI.lastID += 1;
    return String(FrontAPI.lastID);
  }
}
export default FrontAPI;
