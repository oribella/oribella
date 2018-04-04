import { Engine } from './engine';
import { MSPointerFlow } from './flows/ms-pointer';
import { PointerFlow } from './flows/pointer';
import { TouchFlow } from './flows/touch';
import { MouseFlow } from './flows/mouse';
import { Gesture, GestureFactory } from './gesture';
import { ListenerFactory, Listener, DefaultListener } from './listener';
import { Options, OptionsFactory, Data, DataFactory, Supports, SUPPORTS, removeListener } from './utils';

export interface ListenerType {
  type: string;
  listener: Partial<DefaultListener>;
}

export class OribellaApi {
  private engine: Engine;
  private deactivateFlows: removeListener[][] | null = null;

  constructor(
    private element: Element | Document = window && window.document,
  ) {
    this.engine = new Engine(this.element);
  }
  public registerDefaultFlowStrategy(supports: Supports = SUPPORTS) {
    if (supports.msPointerEnabled) {
      this.engine.registerFlow(new MSPointerFlow(this.element));
    }
    if (supports.pointerEnabled) {
      this.engine.registerFlow(new PointerFlow(this.element));
    }
    if (supports.touchEnabled) {
      this.engine.registerFlow(new TouchFlow(this.element));
    }
    this.engine.registerFlow(new MouseFlow(this.element));
  }
  public registerGesture<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>>(GestureClass: GestureFactory<G, O, D, L>, GestureOptions: OptionsFactory = Options, GestureListener: ListenerFactory<O, D> = Listener, GestureData: DataFactory = Data) {
    this.engine.registerGesture(GestureClass, GestureOptions, GestureListener, GestureData);
  }
  public activate() {
    this.deactivateFlows = this.engine.activate();
  }
  public deactivate() {
    if (this.deactivateFlows) {
      this.deactivateFlows.forEach(flow => flow.forEach(f => f()));
      this.deactivateFlows = null;
    }
  }
  public on<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>>(GestureClass: GestureFactory<G, O, D, L>, element: Element, listener: L) {
    return this.engine.registerListener(GestureClass, element, listener);
  }
}
