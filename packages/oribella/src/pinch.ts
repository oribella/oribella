import { OribellaApi, Options, Data, Point, RETURN_FLAG, Gesture, ListenerArgs } from 'oribella-framework';

export class PinchOptions extends Options {
  public pointers: number = 2;
  public pinchThreshold: number = 10;
}

export class PinchData extends Data {
  public distance: number = 0;
  public scale: number = 0;
  public delta: number = 0;
  public centerPoint: Point = new Point(0, 0);
}

export class Pinch extends Gesture<PinchOptions, PinchData> {
  public startPoint0: Point;
  public startPoint1: Point;
  public startDistance: number = 0;
  public currentPoint0: Point;
  public currentPoint1: Point;

  public calculateDistance(p0: Point, p1: Point): number {
    return p1.distanceTo(p0);
  }
  public calculateStartDistance(): number {
    return this.startDistance || (this.startDistance = this.calculateDistance(this.startPoint0, this.startPoint1));
  }
  public calculateCurrentDistance(): number {
    return this.calculateDistance(this.currentPoint0, this.currentPoint1);
  }
  public setData(data: PinchData) {
    this.currentPoint0 = data.pointers[0].page;
    this.currentPoint1 = data.pointers[1].page;

    const startDistance = this.calculateStartDistance();
    const currentDistance = this.calculateCurrentDistance();
    const distance = Math.abs(startDistance - currentDistance);

    data.distance = distance;
    data.scale = currentDistance / startDistance;
    data.delta = currentDistance - startDistance;
    data.centerPoint.x = (this.currentPoint0.x + this.currentPoint1.x) / 2;
    data.centerPoint.y = (this.currentPoint0.y + this.currentPoint1.y) / 2;
  }
  public start(args: ListenerArgs<PinchData>): number {
    const {
      data: {
        pointers: [{ page: p0 }, { page: p1 }],
      },
    } = args;
    this.startPoint0 = p0;
    this.startPoint1 = p1;
    return this.listener.down(args);
  }
  public update(args: ListenerArgs<PinchData>): number {
    const { data } = args;
    this.setData(data);

    if (Math.abs(data.distance) < this.listener.options.pinchThreshold) {
      return RETURN_FLAG.IDLE;
    }
    return !this.startEmitted ? this.listener.start(args) : this.listener.update(args);
  }
  public end(args: ListenerArgs<PinchData>) {
    return this.listener.end(args);
  }
}

export function registerPinch(oribella: OribellaApi) {
  oribella.registerGesture(Pinch, PinchOptions, undefined, PinchData);
}
