import { ipcRenderer } from 'electron';
import RunningTaskEmitter from './models/RunningTaskEmitter';

class FrontAPI {
  private static lastID = 1;

  public static promptChooseZip(): RunningTaskEmitter {
    const requestID = this.generateID();
    const res = new RunningTaskEmitter();
    ipcRenderer.send('promptChooseZip', requestID);
    ipcRenderer.on(`progress:${requestID}`, (_, p) => res.emit('progress', p));
    return res;
  }

  private static generateID() : string {
    FrontAPI.lastID += 1;
    return String(FrontAPI.lastID);
  }
}
export default FrontAPI;
