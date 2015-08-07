/*eslint no-cond-assign: 0*/
import {Flow} from "./flow";

export class TouchFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["touchstart"]
  }, {
      update: ["touchmove"]
  }, {
      end: ["touchend", "mouseup", "click"]
  }, {
      cancel: ["touchcancel", "dragstart"]
  }], true);
  }
  normalizePoints(e, data, Point) {
    var touches, touch;

    switch(e.type) {
      default: {
        touches = Array.prototype.slice.call(e.touches);
        if(e.type === "touchstart" && touches.length === 1) {
          data.pointerIds.length = 0;
          data.pagePoints.length = 0;
        }
        while (touch = touches.shift()) {
          var ix = data.pointerIds.indexOf(touch.identifier);
          if (ix < 0) {
            ix = data.pointerIds.push(touch.identifier) - 1;
          }
          data.pagePoints[ix] = new Point(touch.pageX, touch.pageY);
        }
        break;
      }
      case "click":
      case "mouseup": {
        super.normalizePoints(e, data, Point);
      }
    }
  }
  removePoints(e, data) {
    switch(e.type) {
      default: {
        var touches = Array.prototype.slice.call(e.changedTouches);
        var touch;
        while (touch = touches.shift()) {
          var ix = data.pointerIds.indexOf(touch.identifier);
          data.pointerIds.splice(ix, 1);
          data.pagePoints.splice(ix, 1);
        }
      }
      case "click":
      case "mouseup": {
        super.removePoints(e, data);
      }
    }
  }
}
