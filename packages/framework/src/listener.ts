import { Options, Data, RETURN_FLAG, ensureProperties } from './utils';

export class ListenerArgs<D> {
  public evt: Event;
  public data: D;
  public target: Element;
}

export class DefaultListenerArgs extends ListenerArgs<Data> { }

export class Listener<O extends Options, D extends Data> {
  public selector: string = '';
  public listener: Listener<O, D>;
  constructor(public options: O, listener: Listener<O, D> = {} as Listener<O, D>) {
    this.listener = ensureProperties(listener, {
      selector: '',
      down(_) { },
      start(_) { },
      update(_) { },
      end(_) { },
      cancel() { },
      stop() { }
    } as Listener<O, D>);
  }
  public down(args: ListenerArgs<D>): number { return RETURN_FLAG.map(this.listener.down(args)); }
  public start(args: ListenerArgs<D>): number {
    let result = RETURN_FLAG.map(this.listener.start(args));
    if (!(result & RETURN_FLAG.START_EMITTED)) {
      result += RETURN_FLAG.START_EMITTED;
    }
    return result;
  }
  public update(args: ListenerArgs<D>): number { return RETURN_FLAG.map(this.listener.update(args)); }
  public end(args: ListenerArgs<D>): number { return RETURN_FLAG.map(this.listener.end(args)); }
  public cancel(): number { return RETURN_FLAG.map(this.listener.cancel()); }
  public stop() { this.listener.stop(); }
}

export class DefaultListener extends Listener<Options, Data> { }
