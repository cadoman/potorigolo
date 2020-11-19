import { ipcRenderer, WebContents } from 'electron';
import RunningTaskEmitter from './models/RunningTaskEmitter';

class IPCHandling {
  public static emitterToIPC(
    emitter : RunningTaskEmitter, callerID : string, sender : WebContents,
  ) {
    emitter.on('progress', (progress) => sender.send(`progress:${callerID}`, progress));
  }

  public static IPCToEmitter(callerID : string) : RunningTaskEmitter {
    const emitter = new RunningTaskEmitter();
    ipcRenderer.on(`progress:${callerID}`, (_, progress:number) => emitter.emit('progress', progress));
    return emitter;
  }
}
export default IPCHandling;
