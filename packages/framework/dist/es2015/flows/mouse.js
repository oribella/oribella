import { Flow } from "./flow";

export let MouseFlow = class MouseFlow extends Flow {
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
    switch (event.type) {
      case "mousedown":
      case "mousemove":
        this.allPointers = this.currentPointers = {
          1: {
            page: new Point(event.pageX, event.pageY),
            client: new Point(event.clientX, event.clientY)
          }
        };
        break;
      default:
        this.allPointers = {};
        break;
    }
  }
};
//# sourceMappingURL=mouse.js.map