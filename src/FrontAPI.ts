import { ipcRenderer, nativeImage, NativeImage } from 'electron';
import fs from 'fs';
import AnalysisIndex from './AnalysisIndex';
import IPCHandling from './IPCHandling';
import RunningTaskEmitter from './models/RunningTaskEmitter';
import ConversationSummary from './models/ConversationSummary';
import Tasks from './Tasks';
import RankedMessage from './models/RankedMessage';

const userDataPath = window.process.argv.slice(-1)[0];

class FrontAPI {
  public static getSummary(): Promise<ConversationSummary[]> {
    return FrontAPI.fromFile(AnalysisIndex.summaryFile(userDataPath));
  }

  public static getMessageRankingEmotion(conversationID: string): Promise<RankedMessage[]> {
    return FrontAPI.fromFile(AnalysisIndex.emotionRankingForText(userDataPath, conversationID));
  }

  public static getPictureMessageRankingEmotion(conversationID: string): Promise<RankedMessage[]> {
    return FrontAPI.fromFile(AnalysisIndex.emotionRankingForPicture(userDataPath, conversationID));
  }

  public static getPicture(pictureID:string, conversationID:string) : Promise<string> {
    const photosPath = `${userDataPath}/extraction/messages/inbox/${conversationID}/photos`;
    return new Promise((resolve, reject) => {
      fs.readdir(photosPath, (err, files) => {
        if (err) {
          reject(err);
        }
        const pictureFileName = files.find((f) => f.includes(pictureID));
        const absoluteName = `${photosPath}/${pictureFileName}`;
        console.log('picture is ', absoluteName);
        resolve(absoluteName);
      });
    });
  }

  private static fromFile<T>(filename :string) : Promise<T> {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf-8', (err, data) => {
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

  public static rankTextByEmotion(convID: string): RunningTaskEmitter {
    return FrontAPI.createTask(Tasks.rankTextMessageByEmotions, convID);
  }

  public static rankPicturesByEmotion(convID: string): RunningTaskEmitter {
    return FrontAPI.createTask(Tasks.rankPictureMessageByEmotions, convID);
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
