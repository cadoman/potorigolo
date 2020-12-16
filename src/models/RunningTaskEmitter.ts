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

}

export default RunningTaskEmitter;
