import { OribellaApi, Options, Data, RETURN_FLAG, Gesture, Listener, Point } from 'oribella-framework';

export class Observation {
  constructor(public point: Point, public timeStamp: number) { }
}

export class SwipeData extends Data {
  public timeSeries: Observation[] = [];
  constructor(public maxObservations: number = 5) {
    super();
  }
  public add(point: Point, timeStamp: number) {
    if (this.timeSeries.length === this.maxObservations) {
      this.timeSeries.shift();
    }
    this.timeSeries.push(new Observation(point, timeStamp));
  }
}

export class SwipeOptions extends Options {
  public radiusThreshold: number = 2;
}

export class Swipe extends Gesture<SwipeData, Listener<SwipeOptions, SwipeData>> {
  public startPoint: Point;

  public start(evt: Event, data: SwipeData): number {
    this.startPoint = data.pointers[0].page;
    data.add(this.startPoint, evt.timeStamp);
    return this.listener.down(evt, data, this.target);
  }
  public update(evt: Event, data: SwipeData): number {
    const currentPoint = data.pointers[0].page;
    if (currentPoint.distanceTo(this.startPoint) < this.listener.options.radiusThreshold) {
      return RETURN_FLAG.IDLE;
    }
    data.add(currentPoint, evt.timeStamp);
    if (!this.startEmitted) {
      return this.listener.start(evt, data, this.target);
    }
    return this.listener.update(evt, data, this.target);
  }
  public end(evt: Event, data: SwipeData): number {
    const currentPoint = data.pointers[0].page;
    data.add(currentPoint, evt.timeStamp);
    return this.listener.end(evt, data, this.target);
  }
  public cancel() {
    return this.listener.cancel();
  }
}

export function registerSwipe(oribella: OribellaApi) {
  oribella.registerGesture(Swipe, SwipeOptions, undefined, SwipeData);
}
