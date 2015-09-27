import {Flow} from "./flow";

export class MouseFlow extends Flow {
  constructor(element, Point) {
    super(element, Point, [{
      start: ["mousedown"]
    }, {
      update: ["mousemove"]
    }, {
      end: ["mouseup"]
    }, {
      cancel: ["dragstart", "contextmenu"]
    }], false);
  }
  normalizePoints(event, Point) {
    switch(event.type) {
      case "mousedown":
      case "mousemove":
        this.allPointers = this.currentPointers = {
          1: new Point(event.pageX, event.pageY)
        };
        break;
      default:
        this.allPointers = {};
        break;
    }
  }
}
