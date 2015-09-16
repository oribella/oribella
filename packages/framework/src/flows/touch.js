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
  normalizePoints(event, Point) {
    let map = {};
    switch(event.type) {
      default:
        Array.from(event.changedTouches).forEach(pointer => {
          map[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
        });
        return map;
      case "click":
      case "mouseup":
        return null;
    }
  }
}
