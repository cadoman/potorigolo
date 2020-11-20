import {
  app, dialog, ipcMain,
} from 'electron';
import extract from 'extract-zip';
import IPCHandling from './IPCHandling';
import RunningTaskEmitter from './models/RunningTaskEmitter';

class MessageAnalysisAPI {
  public static initializeListeners(): void {
    ipcMain.on('promptChooseZip',
      (event, callerID : string) => IPCHandling.emitterToIPC(
        MessageAnalysisAPI.promptChooseZip(), callerID, event.sender,
      ));
  }

  private static promptChooseZip() : RunningTaskEmitter {
    const emitter = new RunningTaskEmitter();
    dialog.showOpenDialog(null, {
      title: 'Ouvrez votre archive facebook',
      filters: [{ name: 'Archives', extensions: ['zip'] }],
      properties: ['openFile'],
    }).then((path) => {
      const outPutPath = `${app.getPath('userData')}/extraction`;
      let compressedSize = 0;
      let percent = -1;
      extract(path.filePaths[0], {
        dir: outPutPath,
        onEntry: (entry, zipfile) => {
          compressedSize += entry.compressedSize;
          const newPercent = Math.round((100 * compressedSize) / zipfile.fileSize);
          if (newPercent !== percent) {
            percent = newPercent;
            emitter.emit('progress', percent);
          }
        },
      }).then(() => emitter.emit('done'))
        .catch((error) => emitter.emit('error', error));
    });
    return emitter;
  }
}

export default MessageAnalysisAPI;
