import { Flow, FlowConfig, EventConfig } from '../flow';
import { Point } from '../point';
import { PointerData } from '../utils';

export const POINTER_CONFIG = {
  start: new EventConfig('pointerdown'),
  update: new EventConfig('pointermove'),
  end: new EventConfig('pointerup'),
  cancel: new EventConfig('pointercancel', 'dragstart'),
};
export class PointerFlow extends Flow {
  constructor(element: Element | Document, config: FlowConfig = POINTER_CONFIG) {
    super(element, config);
  }
  public setPointers(evt: PointerEvent) {
    this.changedPointers.clear();
    const page = new Point(evt.pageX, evt.pageY);
    const client = new Point(evt.clientX, evt.clientY);
    const pointerId = evt.pointerId;
    const pointers = { page, client };
    this.changedPointers.set(pointerId, pointers as PointerData);

    switch (evt.type) {
      case 'pointerdown':
      case 'MSPointerDown':
      case 'pointermove':
      case 'MSPointerMove':
        this.allPointers.set(pointerId, pointers as PointerData);
        break;
      default:
        this.allPointers.delete(pointerId);
        break;
    }
  }
}
