import {Flow} from "./flow";
import {Point} from "../point";

export class MSPointerFlow extends Flow {
  constructor(element) {
    super(element, [{
      start: ["MSPointerDown"]
  }, {
      update: ["MSPointerMove"]
  }, {
      end: ["MSPointerUp"]
  }, {
      cancel: ["MSPointerCancel", "dragstart"]
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
