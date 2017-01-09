import { Gesture } from './gesture';
import { DefaultListener } from './listener';

export class ListenerHandle<T extends typeof Gesture> {
  constructor(
    public Type: T,
    public element: Element,
    public listener: DefaultListener) { }
}
