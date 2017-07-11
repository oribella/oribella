import { OribellaApi, Options, Data, RETURN_FLAG, Gesture, Listener, DefaultListener, DefaultListenerArgs } from 'oribella-framework';
import { Longtap, LongtapOptions, LongtapListener } from './longtap';
import { Swipe } from './swipe';

export class LongtapSwipeOptions extends Options {
  public timeThreshold: number = 500;
}

export class LongtapSwipe extends Gesture<Data, Listener<LongtapSwipeOptions, Data>> {
  public unregisterLongtap: () => void;
  public unregisterSwipe: () => void;
  public remove: () => void;
  private allowSwipe: boolean = false;

  public bind(target: Element, registerListener: <T extends typeof Gesture>(Type: T, element: Element, listener: Partial<DefaultListener>) => () => void, remove: () => void) {
    // tslint:disable-next-line:no-object-literal-type-assertion
    this.unregisterLongtap = registerListener(Longtap, target, {
      selector: this.listener.selector,
      options: this.listener.options as LongtapOptions,
      down: () => this.longtapDown(),
      timeEnd: () => this.longtapTimeEnd()
    } as Partial<LongtapListener>);
    this.unregisterSwipe = registerListener(Swipe, target, {
      selector: this.listener.selector,
      options: this.listener.options,
      down: (args: DefaultListenerArgs) => this.swipeDown(args),
      start: (args: DefaultListenerArgs) => this.swipeStart(args),
      update: (args: DefaultListenerArgs) => this.swipeUpdate(args),
      end: (args: DefaultListenerArgs) => this.swipeEnd(args),
      cancel: () => this.swipeCancel()
    });
    this.remove = remove;
  }
  public start(_: DefaultListenerArgs): number {
    return RETURN_FLAG.IDLE;
  }
  public update(_: DefaultListenerArgs): number {
    return RETURN_FLAG.IDLE;
  }
  public end(_: DefaultListenerArgs): number {
    return RETURN_FLAG.IDLE;
  }
  public cancel(): number {
    return RETURN_FLAG.IDLE;
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
