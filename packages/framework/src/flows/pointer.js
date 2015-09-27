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
    this.currentPointers = {};
    this.currentPointers[event.pointerId] = new Point(event.pageX, event.pageY);

    switch(event.type) {
      case "pointerdown":
      case "pointermove":
        this.allPointers[event.pointerId] = new Point(event.pageX, event.pageY);
        break;
      default:
        delete this.allPointers[event.pointerId];
        break;
    }
  }
}
