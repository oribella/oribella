import { Flow, EventConfig } from '../flow';
import { Point } from '../point';
import { PointerData } from '../utils';

export const TOUCH_CONFIG = {
  start: new EventConfig('touchstart'),
  update: new EventConfig('touchmove'),
  end: new EventConfig('touchend'),
  cancel: new EventConfig('touchcancel', 'dragstart'),
};

export class TouchFlow extends Flow {
  constructor(element: Element | Document) {
    super(element, TOUCH_CONFIG);
  }
  public setPointerMapFromList(list: TouchList, pointerMap: Map<number, PointerData>) {
    let i;
    const len = list.length;
    // tslint:disable-next-line:no-increment-decrement
    for (i = 0; i < len; ++i) {
      const touch = list[i];
      const page = new Point(touch.pageX, touch.pageY);
      const client = new Point(touch.clientX, touch.clientY);
      const pointerId = touch.identifier;
      const pointers = { page, client };
      pointerMap.set(pointerId, pointers as PointerData);
    }
  }
  public setPointers(evt: TouchEvent) {
    this.allPointers.clear();
    this.changedPointers.clear();
    this.setPointerMapFromList(evt.touches, this.allPointers);
    this.setPointerMapFromList(evt.changedTouches, this.changedPointers);
  }
}
