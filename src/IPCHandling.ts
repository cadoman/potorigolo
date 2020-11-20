import { ipcRenderer, WebContents } from 'electron';
import RunningTaskEmitter from './models/RunningTaskEmitter';

class IPCHandling {
  public static emitterToIPC(
    emitter : RunningTaskEmitter, callerID : string, sender : WebContents,
  ) {
    emitter.on('progress', (progress) => sender.send(`progress:${callerID}`, progress));
    emitter.on('done', () => sender.send(`done:${callerID}`));
    emitter.on('error', (error) => sender.send(`error:${callerID}`, error));
  }

  public static IPCToEmitter(callerID : string) : RunningTaskEmitter {
    const emitter = new RunningTaskEmitter();
    ipcRenderer.on(`progress:${callerID}`, (_, progress:number) => emitter.emit('progress', progress));
    ipcRenderer.on(`done:${callerID}`, () => emitter.emit('done'));
    ipcRenderer.on(`error:${callerID}`, (_, error:any) => emitter.emit('error', error));
    return emitter;
  }
}
export default IPCHandling;
