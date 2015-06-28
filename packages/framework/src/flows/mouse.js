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
      cancel: ["dragstart"]
    }], false);
  }
}
