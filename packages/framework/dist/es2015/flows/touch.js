import { Flow } from "./flow";

export let TouchFlow = class TouchFlow extends Flow {
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
      this.allPointers[pointer.identifier] = {
        page: new Point(pointer.pageX, pointer.pageY),
        client: new Point(pointer.clientX, pointer.clientY)
      };
    });

    Array.prototype.slice.call(event.changedTouches).forEach(pointer => {
      this.currentPointers[pointer.identifier] = {
        page: new Point(pointer.pageX, pointer.pageY),
        client: new Point(pointer.clientX, pointer.clientY)
      };
    });
  }
};
//# sourceMappingURL=touch.js.map