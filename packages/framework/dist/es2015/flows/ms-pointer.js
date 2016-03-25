import { PointerFlow } from "./pointer";

export let MSPointerFlow = class MSPointerFlow extends PointerFlow {
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
};
//# sourceMappingURL=ms-pointer.js.map