import { Gesture, GestureFactory } from './gesture';
import { Listener, ListenerFactory, DefaultListener } from './listener';
import { Options, OptionsFactory, Data, DataFactory } from './utils';

interface Value {
  GestureClass: typeof Gesture;
  GestureOptions: typeof Options;
  GestureListener: typeof Listener;
  GestureData: typeof Data;
}

export class Registry {
  private gestures: Map<typeof Gesture, Value> = new Map<typeof Gesture, Value>();
  // tslint:disable-next-line:variable-name
  public register<G extends Gesture<O, D, L>, O extends Options, L extends Listener<O, D>, D extends Data>(
    GestureClass: GestureFactory<G, O, D, L>,
    GestureOptions: OptionsFactory = Options,
    GestureListener: ListenerFactory<O, D> = Listener,
    GestureData: DataFactory = Data
  ) {
    // tslint:disable-next-line:object-shorthand-properties-first
    this.gestures.set(GestureClass as typeof Gesture, {
      GestureClass: GestureClass as typeof Gesture,
      GestureOptions,
      GestureListener: GestureListener as typeof Listener,
      GestureData,
    });
  }
  public getTypes() {
    return Array.from(this.gestures.keys());
  }
  public create<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>
  >(GestureClass: GestureFactory<G, O, D, L>, element: Element, listener: DefaultListener) {
    const val = this.gestures.get(GestureClass as typeof Gesture);
    if (!val) {
      throw new Error(`The type ${typeof GestureClass} has not been registered`);
    }
    const options = Object.assign(new val.GestureOptions(), listener.options);
    return new val.GestureClass(new val.GestureListener(options, listener), new val.GestureData(), element);
  }
}
