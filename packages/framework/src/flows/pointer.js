import {Flow} from "./flow";
import {Point} from "../point";

export class PointerFlow extends Flow {
  constructor(element) {
    super(element, [{
      start: ["pointerdown"]
  }, {
      update: ["pointermove"]
  }, {
      end: ["pointerup"]
  }, {
      cancel: ["pointercancel", "dragstart"]
  }]);
  }
  normalizePoints(event) {
    var ix = this.data.pointerIds.indexOf(event.pointerId);
    if (ix < 0) {
      ix = this.data.pointerIds.push(event.pointerId) - 1;
    }
    this.data.pagePoints[ix] = new Point(event.pageX, event.pageY);
  }
  stop() {
    super.stop();
    this.data.pointerIds.length = 0;
  }
}
