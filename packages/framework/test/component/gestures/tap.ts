import { OribellaApi } from '../../../src/oribella-api';
import { Options, Data } from '../../../src/utils';
import { RETURN_FLAG } from '../../../src/utils';
import { Gesture } from '../../../src/gesture';
import { Listener, DefaultListenerArgs } from '../../../src/listener';
import { Point } from '../../../src/point';

export class TapOptions extends Options {
  public radiusThreshold: number = 2;
}

export class Tap extends Gesture<Data, Listener<TapOptions, Data>> {
  public startPoint: Point;
  public start(args: DefaultListenerArgs): number {
    const { data: { pointers: [{ page }] } } = args;
    this.startPoint = page;
    return this.listener.start(args);
  }
  public update({ data: { pointers: [{ page }] } }: DefaultListenerArgs): number {
    return page.distanceTo(this.startPoint) > this.listener.options.radiusThreshold ?
      RETURN_FLAG.REMOVE :
      RETURN_FLAG.IDLE;
  }
}

export function registerTap(oribella: OribellaApi) {
  oribella.registerGesture(Tap, TapOptions);
}
