import {
  OribellaApi,
  Options,
  Data,
  RETURN_FLAG,
  Listener,
  DefaultListener,
  DefaultListenerArgs,
  Gesture,
  GestureFactory,
} from 'oribella-framework';
import { Longtap, LongtapListener, LongtapOptions } from './longtap';
import { Swipe } from './swipe';

export class LongtapSwipeOptions extends Options {
  public timeThreshold: number = 500;
}

export class LongtapSwipe extends Gesture<LongtapSwipeOptions> {
  public unregisterLongtap: () => void;
  public unregisterSwipe: () => void;
  public remove: () => void;
  private allowSwipe: boolean = false;

  // tslint:disable-next-line:variable-name
  public bind(
    target: Element,
    registerListener: <G extends Gesture<O, D, L>, O extends Options, D extends Data, L extends Listener<O, D>>(
      GestureClass: GestureFactory<G, O, D, L>,
      element: Element,
      listener: Partial<DefaultListener>
    ) => () => void,
    remove: () => void
  ) {
    this.unregisterLongtap = registerListener(Longtap, target, {
      selector: this.listener.selector,
      options: this.listener.options as LongtapOptions,
      down: () => this.longtapDown(),
      timeEnd: () => this.longtapTimeEnd(),
    } as Partial<LongtapListener>);
    this.unregisterSwipe = registerListener(Swipe, target, {
      selector: this.listener.selector,
      options: this.listener.options,
      down: (args: DefaultListenerArgs) => this.swipeDown(args),
      start: (args: DefaultListenerArgs) => this.swipeStart(args),
      update: (args: DefaultListenerArgs) => this.swipeUpdate(args),
      end: (args: DefaultListenerArgs) => this.swipeEnd(args),
      cancel: () => this.swipeCancel(),
    });
    this.remove = remove;
  }
  public longtapDown() {
    this.allowSwipe = false;
    return RETURN_FLAG.IDLE;
  }
  public longtapTimeEnd() {
    this.allowSwipe = true;
    return RETURN_FLAG.IDLE;
  }
  public swipeDown(args: DefaultListenerArgs) {
    return this.listener.down(args);
  }
  public swipeStart(args: DefaultListenerArgs) {
    if (!this.allowSwipe) {
      this.remove();
      return RETURN_FLAG.REMOVE;
    }
    return this.listener.start(args);
  }
  public swipeUpdate(args: DefaultListenerArgs) {
    return this.listener.update(args);
  }
  public swipeEnd(args: DefaultListenerArgs) {
    return this.listener.end(args);
  }
  public swipeCancel() {
    return this.listener.cancel();
  }
}

export function registerLongtapSwipe(oribella: OribellaApi) {
  oribella.registerGesture(LongtapSwipe, LongtapSwipeOptions);
}
