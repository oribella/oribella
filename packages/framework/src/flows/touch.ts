import { Flow, EventConfig } from '../flow';
import { Point } from '../point';
import { PointerData } from '../utils';

export const TouchConfig = {
  start: new EventConfig('touchstart'),
  update: new EventConfig('touchmove'),
  end: new EventConfig('touchend'),
  cancel: new EventConfig('touchcancel', 'dragstart')
};

export class TouchFlow extends Flow {
  constructor(element: Element | Document) {
    super(element, TouchConfig);
  }
  public setPointerMapFromList(list: TouchList, pointerMap: Map<number, PointerData>) {
    let i;
    const len = list.length;
    for (i = 0; i < len; ++i) {
      const touch = list[i];
      const page = new Point(touch.pageX, touch.pageY);
      const client = new Point(touch.clientX, touch.clientY);
      const pointerId = touch.identifier;
      const pointers = { page, client };
      pointerMap.set(pointerId, pointers);
    }
  }
  public setPointers(evt: TouchEvent) {
    this.allPointers.clear();
    this.changedPointers.clear();
    this.setPointerMapFromList(evt.touches, this.allPointers);
    this.setPointerMapFromList(evt.changedTouches, this.changedPointers);
  }
}
