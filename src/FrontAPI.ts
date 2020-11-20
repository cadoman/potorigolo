import { ipcRenderer } from 'electron';
import IPCHandling from './IPCHandling';
import RunningTaskEmitter from './models/RunningTaskEmitter';

class FrontAPI {
  private static lastID = 1;

  public static promptChooseZip(): RunningTaskEmitter {
    const requestID = this.generateID();
    ipcRenderer.send('promptChooseZip', requestID);
    return IPCHandling.IPCToEmitter(requestID);
  }

  private static generateID() : string {
    FrontAPI.lastID += 1;
    return String(FrontAPI.lastID);
  }
}
export default FrontAPI;
