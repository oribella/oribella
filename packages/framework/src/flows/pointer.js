import {Flow} from "./flow";

export class PointerFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["pointerdown"]
  }, {
      update: ["pointermove"]
  }, {
      end: ["pointerup"]
  }, {
      cancel: ["pointercancel", "dragstart"]
  }]);
  }
  normalizePoints(event, Point) {
    let map = {};
    map[event.pointerId] = new Point(event.pageX, event.pageY);
    return map;
  }
}
