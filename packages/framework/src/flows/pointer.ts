import {Flow, FlowConfig, EventConfig} from '../flow';
import {Point} from '../point';

export const PointerConfig = {
  start: new EventConfig('pointerdown'),
  update: new EventConfig('pointermove'),
  end: new EventConfig('pointerup'),
  cancel: new EventConfig('pointercancel', 'dragstart')
};
export class PointerFlow extends Flow {
  constructor(element: Element | Document, config: FlowConfig = PointerConfig) {
    super(element, config);
  }
  public setPointers(evt: PointerEvent) {
    this.changedPointers.clear();
    const page = new Point(evt.pageX, evt.pageY);
    const client = new Point(evt.clientX, evt.clientY);
    const pointerId = evt.pointerId;
    const pointers = { page, client };
    this.changedPointers.set(pointerId, pointers);

    switch (evt.type) {
      case 'pointerdown':
      case 'MSPointerDown':
      case 'pointermove':
      case 'MSPointerMove':
        this.allPointers.set(pointerId, pointers);
        break;
      default:
        this.allPointers.delete(pointerId);
        break;
    }
  }
}
