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
    this.allPointers = {};
    this.currentPointers = {};

    Array.prototype.slice.call(event.touches).forEach(pointer => {
      this.allPointers[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
    });

    Array.prototype.slice.call(event.changedTouches).forEach(pointer => {
      this.currentPointers[pointer.identifier] = new Point(pointer.pageX, pointer.pageY);
    });

  }
}
