import { Oribella } from '../../../src/oribella';
import { Options, Data } from '../../../src/utils';
import { RETURN_FLAG } from '../../../src/utils';
import { Gesture } from '../../../src/gesture';
import { Listener } from '../../../src/listener';
import { Point } from '../../../src/point';

export class RotateOptions extends Options {
  public pointers: number = 2;
  public rotationThreshold: number = 10;
}

export class RotateData extends Data {
  public rotation: number = 0;
}

export class Rotate extends Gesture<RotateData, Listener<RotateOptions, RotateData>> {
  public startPoint0: Point;
  public startPoint1: Point;
  public currentPoint0: Point;
  public currentPoint1: Point;

  public calculateRotation(p0: Point, p1: Point, p2: Point, p3: Point) {
    const a0 = p0.deltaAngleTo(p1);
    const a1 = p2.deltaAngleTo(p3);
    return a1 - a0;
  }
  public setData(data: RotateData) {
    this.currentPoint0 = data.pointers[0].page;
    this.currentPoint1 = data.pointers[1].page;
    data.rotation = this.calculateRotation(this.startPoint0, this.startPoint1, this.currentPoint0, this.currentPoint1);
  }
  public start(evt: Event, data: RotateData): number {
    this.startPoint0 = data.pointers[0].page;
    this.startPoint1 = data.pointers[1].page;
    return this.listener.down(evt, data, this.target);
  }
  public update(evt: Event, data: RotateData): number {
    this.setData(data);

    if (Math.abs(data.rotation) < this.listener.options.rotationThreshold) {
      return RETURN_FLAG.IDLE;
    }
    if (!this.startEmitted) {
      return this.listener.start(evt, data, this.target);
    }
    return this.listener.update(evt, data, this.target);
  }
  public end(evt: Event, data: RotateData): number {
    return this.listener.end(evt, data, this.target);
  }
  public cancel() {
    return this.listener.cancel();
  }
}

export function register(oribella: Oribella) {
  oribella.registerGesture(Rotate, RotateOptions, undefined, RotateData);
}
