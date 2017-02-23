import { OribellaApi } from '../../../src/oribella-api';
import { Options, Data } from '../../../src/utils';
import { RETURN_FLAG } from '../../../src/utils';
import { Gesture } from '../../../src/gesture';
import { Listener, ListenerArgs } from '../../../src/listener';
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
  public start(args: ListenerArgs<RotateData>): number {
    const { data: { pointers: [{ page: p0 }, { page: p1 }] } } = args;
    this.startPoint0 = p0;
    this.startPoint1 = p1;
    return this.listener.down(args);
  }
  public update(args: ListenerArgs<RotateData>): number {
    const { data } = args;
    this.setData(data);

    if (Math.abs(data.rotation) < this.listener.options.rotationThreshold) {
      return RETURN_FLAG.IDLE;
    }
    return !this.startEmitted ?
      this.listener.start(args) :
      this.listener.update(args);
  }
  public end(args: ListenerArgs<RotateData>) {
    return this.listener.end(args);
  }
}

export function registerRotate(oribella: OribellaApi) {
  oribella.registerGesture(Rotate, RotateOptions, undefined, RotateData);
}
