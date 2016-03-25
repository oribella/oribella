import { Flow } from "./flow";

export let PointerFlow = class PointerFlow extends Flow {
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
    this.currentPointers[event.pointerId] = {
      page: new Point(event.pageX, event.pageY),
      client: new Point(event.clientX, event.clientY)
    };

    switch (event.type) {
      case "pointerdown":
      case "pointermove":
        this.allPointers[event.pointerId] = {
          page: new Point(event.pageX, event.pageY),
          client: new Point(event.clientX, event.clientY)
        };
        break;
      default:
        delete this.allPointers[event.pointerId];
        break;
    }
  }
};
//# sourceMappingURL=pointer.js.map