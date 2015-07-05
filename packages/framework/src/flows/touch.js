/*eslint no-cond-assign: 0*/
import {Flow} from "./flow";

export class TouchFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["touchstart"]
  }, {
      update: ["touchmove"]
  }, {
      end: ["touchend", "mouseup"]
  }, {
      cancel: ["touchcancel", "dragstart"]
  }], true);
  }
  normalizePoints(event, data, Point) {
    var touches, touch;

    switch(event.type) {
      default: {
        touches = Array.prototype.slice.call(event.touches);
        while (touch = touches.shift()) {
          var ix = data.pointerIds.indexOf(touch.identifier);
          if (ix < 0) {
            ix = data.pointerIds.push(touch.identifier) - 1;
          }
          data.pagePoints[ix] = new Point(touch.pageX, touch.pageY);
        }
        break;
      }
      case "mouseup": {
        super.normalizePoints(event, data, Point);
      }
    }
  }
  removePoints(event, data) {
    var touches = Array.prototype.slice.call(event.changedTouches);
    var touch;
    while (touch = touches.shift()) {
      var ix = data.pointerIds.indexOf(touch.identifier);
      data.pointerIds.splice(ix, 1);
      data.pagePoints.splice(ix, 1);
    }
  }
}
