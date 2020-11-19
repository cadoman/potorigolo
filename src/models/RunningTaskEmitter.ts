import { EventEmitter } from 'events';

declare interface RunningTaskEmitter{
  on(event: 'progress', listener : (progress : number) => void) : this
  emit(event: 'progress', progress : number) : boolean
}

class RunningTaskEmitter extends EventEmitter {

}

export default RunningTaskEmitter;
