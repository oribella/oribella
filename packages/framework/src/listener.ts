import { Options, Data, RETURN_FLAG, ensureProperties } from './utils';

export class Listener<O extends Options, D extends Data> {
  public selector: string = '';
  public listener: Listener<O, D>;
  constructor(public options: O, listener: Listener<O, D> = {} as Listener<O, D>) {
    this.listener = ensureProperties(listener, {
      selector: '',
      down(_1, _2, _3) { },
      start(_1, _2, _3) { },
      update(_1, _2, _3) { },
      end(_1, _2, _3) { },
      cancel() { },
      stop() {}
    } as Listener<O, D>);
  }
  public down(evt: Event, data: D, target: Element): number { return RETURN_FLAG.map(this.listener.down(evt, data, target)); }
  public start(evt: Event, data: D, target: Element): number {
    let result = RETURN_FLAG.map(this.listener.start(evt, data, target));
    if (!(result & RETURN_FLAG.START_EMITTED)) {
      result += RETURN_FLAG.START_EMITTED;
    }
    return result;
  }
  public update(evt: Event, data: D, target: Element): number { return RETURN_FLAG.map(this.listener.update(evt, data, target)); }
  public end(evt: Event, data: D, target: Element): number { return RETURN_FLAG.map(this.listener.end(evt, data, target)); }
  public cancel(): number { return RETURN_FLAG.map(this.listener.cancel()); }
  public stop() { this.listener.stop(); }
}

export class DefaultListener extends Listener<Options, Data> { }
