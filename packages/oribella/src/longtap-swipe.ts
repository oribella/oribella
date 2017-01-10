import { Oribella, Options, Data, RETURN_FLAG, Gesture, Listener, DefaultListener } from 'oribella-framework';
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
    this.unregisterLongtap = registerListener(Longtap, target, {
      selector: this.listener.selector,
      options: this.listener.options as LongtapOptions,
      down: () => this.longtapDown(),
      timeEnd: () => this.longtapTimeEnd()
    } as Partial<LongtapListener>);
    this.unregisterSwipe = registerListener(Swipe, target, {
      selector: this.listener.selector,
      options: this.listener.options,
      down: (evt: Event, data: Data) => this.swipeDown(evt, data),
      start: (evt: Event, data: Data) => this.swipeStart(evt, data),
      update: (evt: Event, data: Data) => this.swipeUpdate(evt, data),
      end: (evt: Event, data: Data) => this.swipeEnd(evt, data),
      cancel: () => this.swipeCancel()
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
  public swipeDown(evt: Event, data: Data) {
    return this.listener.down(evt, data, this.target);
  }
  public swipeStart(evt: Event, data: Data) {
    if (!this.allowSwipe) {
      this.remove();
      return RETURN_FLAG.REMOVE;
    }
    return this.listener.start(evt, data, this.target);
  }
  public swipeUpdate(evt: Event, data: Data) {
    return this.listener.update(evt, data, this.target);
  }
  public swipeEnd(evt: Event, data: Data) {
    return this.listener.end(evt, data, this.target);
  }
  public swipeCancel() {
    return this.listener.cancel();
  }
}

export function registerLongtapSwipe(oribella: Oribella) {
  oribella.registerGesture(LongtapSwipe, LongtapSwipeOptions);
}
