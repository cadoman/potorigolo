import {
  app, dialog, ipcMain,
} from 'electron';
import extract from 'extract-zip';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import IPCHandling from './IPCHandling';
import RunningTaskEmitter from './models/RunningTaskEmitter';
import Tasks from './Tasks';
import AnalysisIndex from './AnalysisIndex';

const messagesPath = `${app.getPath('userData')}/extraction/messages`;

class MessageAnalysisAPI {
  public static initializeListeners(): void {
    ipcMain.on(Tasks.promptChooseZip, (event, callerID: string) => IPCHandling.emitterToIPC(
      MessageAnalysisAPI.promptChooseZip(), callerID, event.sender,
    ));

    ipcMain.on(Tasks.buildSummary, (event, callerID: string) => IPCHandling.emitterToIPC(
      MessageAnalysisAPI.executePython(
        'build_summary',
        messagesPath,
        AnalysisIndex.summaryFile(app.getPath('userData')),
      ), callerID, event.sender,
    ));

    ipcMain.on(Tasks.rankMessageByEmotions, (event, callerID: string, conversationID: string) => IPCHandling.emitterToIPC(
      MessageAnalysisAPI.executePython(
        'message_emotion_ranking',
        messagesPath,
        AnalysisIndex.emotionRanking(app.getPath('userData'), conversationID),
        conversationID,
      ), callerID, event.sender,
    ));
  }

  private static promptChooseZip(): RunningTaskEmitter {
    const emitter = new RunningTaskEmitter();
    dialog.showOpenDialog(null, {
      title: 'Ouvrez votre archive facebook',
      filters: [{ name: 'Archives', extensions: ['zip'] }],
      properties: ['openFile'],
    }).then((chosenFile) => {
      const outPutPath = `${app.getPath('userData')}/extraction`;
      let compressedSize = 0;
      let percent = -1;
      extract(chosenFile.filePaths[0], {
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

  private static executePython(opName: string, messagePath: string, outputPath: string, ...args: string[]): RunningTaskEmitter {
    const pyMainPath = `${__dirname}/python/main.py`;
    const progressFile = `${__dirname}/python/progress.txt`;

    const res = new RunningTaskEmitter();
    let ls;

    if (process.env.APP_DEV?.trim() === 'true') {
      try {
        ls = spawn('python3', [pyMainPath, opName, messagePath, outputPath, ...args]);
        console.log(`python command : python3 ${pyMainPath} ${opName} ${messagesPath} ${outputPath}`);
      } catch (error) {
        console.error('caught the error', error);
      }
    }
    try {
      fs.watch(path.dirname(progressFile), () => {
        console.log('watch emitted');
        fs.readFile(progressFile, { encoding: 'utf-8' }, (err, content) => {
          res.emit('progress', +content);
        });
      });
    } catch (error) {
      console.log('caught watch error : ', error);
    }
    ls.on('error', (err) => {
      console.log('error');
      res.emit('error', `Could not run python3 : ${err.name} ${err.message}`);
    });
    ls.stdout.on('data', (data: Buffer) => {
      console.log('stdout : ', data.toString());
      res.emit('log', data.toString());
    });
    ls.stderr.on('data', (data: Buffer) => {
      console.log('python stderr : ', data.toString());
      res.emit('error', data.toString());
    });
    ls.on('exit', (code) => {
      if (code === 0) {
        res.emit('done');
      } else {
        res.emit('error', code);
      }
    });
    return res;
  }
}

export default MessageAnalysisAPI;
