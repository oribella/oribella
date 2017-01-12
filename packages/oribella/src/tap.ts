import { OribellaApi, Options, Data, RETURN_FLAG, Gesture, Listener, Point } from 'oribella-framework';

export class TapOptions extends Options {
  public radiusThreshold: number = 2;
}

export class Tap extends Gesture<Data, Listener<TapOptions, Data>> {
  public startPoint: Point;

  public start(evt: Event, data: Data): number {
    this.startPoint = data.pointers[0].page;
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
    return this.listener.end(evt, data, this.target);
  }
  public cancel() {
    return this.listener.cancel();
  }
}

export function registerTap(oribella: OribellaApi) {
  oribella.registerGesture(Tap, TapOptions);
}
