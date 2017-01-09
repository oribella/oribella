import { Oribella, Options, Data, RETURN_FLAG, Gesture, Listener, DefaultListener } from 'oribella-framework';
import { Tap } from './tap';

export class DoubletapOptions extends Options {
  public timeThreshold: number = 250;
}

export class Doubletap extends Gesture<Data, Listener<DoubletapOptions, Data>> {
  public unregisterTap: () => void;
  public remove: () => void;
  public timeoutId: number = 0;
  public count: number = 0;

  public bind(target: Element, registerListener: <T extends typeof Gesture>(Type: T, element: Element, listener: Partial<DefaultListener>) => () => void, remove: () => void) {
    this.unregisterTap = registerListener(Tap, target, {
      selector: this.listener.selector,
      options: this.listener.options,
      end: this.tapEnd.bind(this)
    });
    this.remove = remove;
  }
  public unbind() {
    if (this.count > 1) {
      this.unregisterTap();
      return RETURN_FLAG.REMOVE;
    }
    return RETURN_FLAG.COMPOSE;
  }
  public tapEnd(evt: Event, data: Data) {
    ++this.count;
    if (this.count === 1) {
      this.timeoutId = window.setTimeout(() => {
        this.remove();
        this.unregisterTap();
      }, this.listener.options.timeThreshold);
    } else if (this.count === 2) {
      window.clearTimeout(this.timeoutId);
      return this.listener.end(evt, data, this.target);
    }
    return RETURN_FLAG.IDLE;
  }
}

export function register(oribella: Oribella) {
  oribella.registerGesture(Doubletap, DoubletapOptions);
}
