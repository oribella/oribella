import { Gesture } from './gesture';
import { Listener, DefaultListener } from './listener';
import { Options, Data } from './utils';

interface Value {
  Gesture: typeof Gesture;
  GestureOptions: typeof Options;
  GestureListener: typeof Listener;
  GestureData: typeof Data;
}

export class Registry {
  private gestures: Map<typeof Gesture, Value> = new Map<typeof Gesture, Value>();
  public register<G extends typeof Gesture, O extends typeof Options, L extends typeof Listener, D extends typeof Data>(Gesture: G, GestureOptions: O = Options as O, GestureListener: L = Listener as L, GestureData: D = Data as D) {
    this.gestures.set(Gesture, { Gesture, GestureOptions, GestureListener, GestureData });
  }
  public getTypes() {
    return Array.from(this.gestures.keys());
  }
  public create<T extends typeof Gesture>(Type: T, element: Element, listener: DefaultListener) {
    const val = this.gestures.get(Type);
    if (!val) {
      throw new Error(`The type ${typeof Type} has not been registered`);
    }
    const options = Object.assign(new val.GestureOptions(), listener.options);
    return new val.Gesture(new val.GestureListener(options, listener), new val.GestureData(), element);
  }
}
