import { Data, PointerData } from './utils';
import { DefaultListener, ListenerArgs } from './listener';

export class Gesture<D extends Data, L extends DefaultListener> {
  public __POINTERIDS__: number[] = [];
  public __REMOVED_POINTERS__: PointerData[] = [];
  public startEmitted: boolean = false;
  public args: ListenerArgs<D> = {} as ListenerArgs<D>;
  constructor(public listener: L, public data: D, public target: Element) {
    this.args.data = data;
    this.args.target = target;
  }

  public bind(target: Element, registerListener: <T extends typeof Gesture>(Type: T, element: Element, listener: Partial<DefaultListener>) => () => void, remove: () => void, evt: Event): void;
  public bind() { }
  public unbind(): number { return 0; }
  public start(args: ListenerArgs<D>): number {
    return this.listener.start(args);
  }
  public update(args: ListenerArgs<D>): number {
    return this.listener.update(args);
  }
  public end(args: ListenerArgs<D>): number {
    return this.listener.end(args);
  }
  public cancel(): number { return this.listener.cancel(); }
  public stop(): void { this.listener.stop(); }
}

export class DefaultGesture extends Gesture<Data, DefaultListener> { }
