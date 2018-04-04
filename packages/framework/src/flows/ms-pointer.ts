import { EventConfig } from '../flow';
import { PointerFlow } from './pointer';

export const MS_POINTER_CONFIG = {
  start: new EventConfig('MSPointerDown'),
  update: new EventConfig('MSPointerMove'),
  end: new EventConfig('MSPointerUp'),
  cancel: new EventConfig('MSPointerCancel', 'dragstart'),
};
export class MSPointerFlow extends PointerFlow {
  constructor(element: Element | Document) {
    super(element, MS_POINTER_CONFIG);
  }
}
