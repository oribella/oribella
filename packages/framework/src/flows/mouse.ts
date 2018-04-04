import { Flow, EventConfig } from '../flow';
import { Point } from '../point';
import { PointerData } from '../utils';

export const MOUSE_CONFIG = {
  start: new EventConfig('mousedown'),
  update: new EventConfig('mousemove'),
  end: new EventConfig('mouseup'),
  cancel: new EventConfig('dragstart'),
};

export class MouseFlow extends Flow {
  constructor(element: Element | Document) {
    super(element, MOUSE_CONFIG);
  }
  public setPointers(evt: MouseEvent) {
    const page = new Point(evt.pageX, evt.pageY);
    const client = new Point(evt.clientX, evt.clientY);
    this.changedPointers.set(1, { page, client } as PointerData);

    switch (evt.type) {
      case 'mousedown':
      case 'mousemove':
        this.allPointers.set(1, { page, client } as PointerData);
        break;
      default:
        this.allPointers.clear();
        break;
    }
  }
}
