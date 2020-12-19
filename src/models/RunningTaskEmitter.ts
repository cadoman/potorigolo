import { EventEmitter } from 'events';

declare interface RunningTaskEmitter {
  on(event: 'start', listener: () => void): this
  emit(event: 'start'): boolean

  on(event: 'progress', listener: (progress: number) => void): this
  emit(event: 'progress', progress: number): boolean

  on(event: 'done', listener: () => void): this
  emit(event: 'done'): boolean

  on(event: 'canceled', listener: () => void): this
  emit(event: 'canceled'): boolean

  on(event: 'error', listener: (error: any) => void): this
  emit(event: 'error', error: any): boolean

  on(event: 'log', listener: (log: string) => void): this
  emit(event: 'log', log: string): boolean
}

class RunningTaskEmitter extends EventEmitter {
  public static all(tasks : RunningTaskEmitter[]) : RunningTaskEmitter {
    const res = new RunningTaskEmitter();
    const progresses = new Array(tasks.length).fill(0);
    const doneStatus = new Array(tasks.length).fill(false);
    tasks.forEach((task, index) => {
      task.on('start', () => res.emit('start'));
      task.on('progress', (progress) => {
        progresses[index] = progress;
        res.emit('progress', progresses.reduce((a, b) => a + b) / progresses.length);
      });
      task.on('done', () => {
        doneStatus[index] = true;
        if (doneStatus.every((v) => v === true)) {
          res.emit('done');
        }
      });
      task.on('canceled', () => res.emit('canceled'));
      task.on('error', (e) => res.emit('error', e));
      task.on('log', (l) => res.emit('log', l));
    });
    return res;
  }
}

export default RunningTaskEmitter;
