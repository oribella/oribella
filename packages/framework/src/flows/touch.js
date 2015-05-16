/*eslint no-cond-assign: 0*/
import {Flow} from "./flow";
import {Point} from "../point";

export class TouchFlow extends Flow {
  constructor(element) {
    super(element, [{
      start: ["touchstart"]
  }, {
      update: ["touchmove"]
  }, {
      end: ["touchend", "mouseup"]
  }, {
      cancel: ["touchcancel", "dragstart"]
  }], true);
  }
  normalizePoints(event) {
    this.data.pagePoints.length = 0;
    var touches = Array.prototype.slice.call(event.touches),
      touch;

    if (event.type === "touchend") {
      touches = touches.concat(Array.prototype.slice.call(event.changedTouches));
    }

    while (touch = touches.shift()) {
      this.data.pagePoints.push(new Point(touch.pageX, touch.pageY));
    }
  }
}
