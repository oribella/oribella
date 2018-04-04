import { OribellaApi } from '../../../src/oribella-api';
import { Options, Data, RETURN_FLAG } from '../../../src/utils';
import { Gesture } from '../../../src/gesture';
import { ListenerArgs } from '../../../src/listener';
import { Point } from '../../../src/point';

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

export class Swipe extends Gesture<SwipeOptions, SwipeData> {
  public startPoint: Point;
  public start({ data, evt }: ListenerArgs<SwipeData>): number {
    const { pointers: [{ page }] } = data;
    this.startPoint = page;
    data.add(this.startPoint, evt.timeStamp);
    return this.listener.down(this.args);
  }
  public update(args: ListenerArgs<SwipeData>): number {
    const { data, evt } = args;
    const { pointers: [{ page }] } = data;
    if (page.distanceTo(this.startPoint) < this.listener.options.radiusThreshold) {
      return RETURN_FLAG.IDLE;
    }
    data.add(page, evt.timeStamp);
    if (!this.startEmitted) {
      return this.listener.start(args);
    }
    return this.listener.update(args);
  }
  public end(args: ListenerArgs<SwipeData>): number {
    const { data, evt } = args;
    const { pointers: [{ page }] } = data;
    data.add(page, evt.timeStamp);
    return this.listener.end(args);
  }
}

export function registerSwipe(oribella: OribellaApi) {
  oribella.registerGesture(Swipe, SwipeOptions, undefined, SwipeData);
}
