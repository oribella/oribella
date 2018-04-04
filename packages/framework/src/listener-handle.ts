import { Gesture, GestureFactory } from './gesture';
import { Listener } from './listener';
import { Options, Data } from './utils';

export class ListenerHandle<
  G extends Gesture<O, D, L>,
  O extends Options,
  D extends Data,
  L extends Listener<O, D>> {
  // tslint:disable-next-line:variable-name
  constructor(public GestureClass: GestureFactory<G, O, D, L>, public element: Element, public listener: L) { }
}

export class DefaultListenerHandle extends ListenerHandle<Gesture, Options, Data, Listener> { }
