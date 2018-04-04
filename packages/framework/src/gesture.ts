import { Options, Data, PointerData, RETURN_FLAG } from './utils';
import { Listener, DefaultListener, ListenerArgs } from './listener';

export interface GestureFactory<
  G extends Gesture<O, D, L>,
  O extends Options = Options,
  D extends Data = Data,
  L extends Listener<O, D> = Listener<O, D>> {
  new(listener: L, data: D, target: Element): G;
}

export class Gesture<O extends Options = Options, D extends Data = Data, L extends Listener<O, D> = Listener<O, D>> {
  public __POINTERIDS__: number[] = [];
  public __REMOVED_POINTERS__: PointerData[] = [];
  public startEmitted: boolean = false;
  public args: ListenerArgs<D> = {} as ListenerArgs<D>;
  constructor(public listener: L, public data: D, public target: Element) {
    this.args.data = data;
    this.args.target = target;
  }

  // tslint:disable-next-line:variable-name
  public bind(target: Element, registerListener: <G extends Gesture<O, D, L>, O extends Options, D extends Data, L extends Listener<O, D>>(Type: GestureFactory<G, O, D, L>, element: Element, listener: Partial<DefaultListener>) => () => void, remove: () => void, evt: Event): void;
  public bind() { }
  public unbind(): number { return RETURN_FLAG.IDLE; }
  public start(args: ListenerArgs<D>): number;
  public start() { return RETURN_FLAG.IDLE; }
  public update(args: ListenerArgs<D>): number;
  public update() { return RETURN_FLAG.IDLE; }
  public end(args: ListenerArgs<D>): number;
  public end() { return RETURN_FLAG.IDLE; }
  public cancel(): number { return this.listener.cancel(); }
  public stop(): void { this.listener.stop(); }
}
