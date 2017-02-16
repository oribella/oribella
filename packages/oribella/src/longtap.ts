import { OribellaApi, Options, Data, RETURN_FLAG, Gesture, Listener, Point, ensureProperties } from 'oribella-framework';

export class LongtapOptions extends Options {
  public radiusThreshold: number = 2;
  public timeThreshold: number = 500;
}

export class LongtapListener extends Listener<LongtapOptions, Data> {
  public listener: LongtapListener;
  constructor(public options: LongtapOptions, listener: LongtapListener) {
    super(options, listener);
    this.listener = ensureProperties(listener, {
      timeEnd() { }
    } as LongtapListener);
  }
  public timeEnd(): number { return RETURN_FLAG.map(this.listener.timeEnd()); }
}

export class Longtap extends Gesture<Data, LongtapListener> {
  public startPoint: Point;
  public timeoutId: number = 0;
  public timeEndEmitted: boolean = false;

  public start(evt: Event, data: Data): number {
    this.startPoint = data.pointers[0].page;
    this.timeoutId = window.setTimeout(() => {
      this.listener.timeEnd();
      this.timeEndEmitted = true;
    }, this.listener.options.timeThreshold);
    return this.listener.start(evt, data, this.target);
  }
  public update(_: Event, data: Data): number {
    const p = data.pointers[0].page;
    if (p.distanceTo(this.startPoint) > this.listener.options.radiusThreshold) {
      return RETURN_FLAG.REMOVE;
    }
    return RETURN_FLAG.IDLE;
  }
  public end(evt: Event, data: Data): number {
    window.clearTimeout(this.timeoutId);
    if (!this.timeEndEmitted) {
      return RETURN_FLAG.REMOVE;
    }
    return this.listener.end(evt, data, this.target);
  }
  public cancel() {
    window.clearTimeout(this.timeoutId);
    return this.listener.cancel();
  }
}

export function registerLongtap(oribella: OribellaApi) {
  oribella.registerGesture(Longtap, LongtapOptions, LongtapListener);
}
