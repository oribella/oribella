import {Flow} from "./flow";

export class MSPointerFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["MSPointerDown"]
  }, {
      update: ["MSPointerMove"]
  }, {
      end: ["MSPointerUp"]
  }, {
      cancel: ["MSPointerCancel", "dragstart"]
  }]);
  }
  normalizePoints(event, Point) {
    let map = {};
    map[event.pointerId] = new Point(event.pageX, event.pageY);
    return map;
  }
}
