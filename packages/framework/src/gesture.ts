import { Data, PointerData } from './utils';
import { DefaultListener } from './listener';

export class Gesture<D extends Data, L extends DefaultListener> {
  public __POINTERIDS__: number[] = [];
  public __REMOVED_POINTERS__: PointerData[] = [];
  public startEmitted: boolean = false;
  constructor(public listener: L, public data: D, public target: Element) { }

  public bind(target: Element, registerListener: <T extends typeof Gesture>(Type: T, element: Element, listener: Partial<DefaultListener>) => () => void, remove: () => void): void;
  public bind() { }
  public unbind(): number { return 0; }
  public start(evt: Event, data: D): number;
  public start() { return 0; }
  public update(evt: Event, data: D): number;
  public update() { return 0; }
  public end(evt: Event, data: D): number;
  public end() { return 0; }
  public cancel(): number { return 0; }
  public stop(): void {}
}

export class DefaultGesture extends Gesture<Data, DefaultListener> { }
