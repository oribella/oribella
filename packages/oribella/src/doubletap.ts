import { OribellaApi, Options, Data, RETURN_FLAG, Gesture, DefaultListenerArgs, Point } from 'oribella-framework';
import { Tap } from './tap';

export class DoubletapOptions extends Options {
  public timeThreshold: number = 250;
}

export class Doubletap extends Gesture<DoubletapOptions> {
  public unregisterTap: () => void;
  public remove: () => void;
  public timeoutId: number = 0;
  public count: number = 0;

  // tslint:disable-next-line:variable-name
  public bind(target: Element, registerListener: <G extends Gesture<O, D, L>, O extends Options, D extends Data, L extends Listener<O, D>> (GestureClass: GestureFactory<G, O, D, L>, element: Element, listener: Partial<DefaultListener>) => () => void, remove: () => void) {
    this.unregisterTap = registerListener(Tap, target, {
      selector: this.listener.selector,
      options: this.listener.options,
      end: this.tapEnd.bind(this),
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
  public tapEnd(args: DefaultListenerArgs) {
    this.count += 1;
    if (this.count === 1) {
      this.timeoutId = window.setTimeout(() => {
        this.remove();
        this.unregisterTap();
      },                                 this.listener.options.timeThreshold);
    } else if (this.count === 2) {
      window.clearTimeout(this.timeoutId);
      return this.listener.end(args);
    }
    return RETURN_FLAG.IDLE;
  }
}

export function registerDoubletap(oribella: OribellaApi) {
  oribella.registerGesture(Doubletap, DoubletapOptions);
}
