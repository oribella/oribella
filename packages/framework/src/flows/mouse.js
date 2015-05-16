import {Flow} from "./flow";

export class MouseFlow extends Flow {
  constructor(element) {
    super(element, [{
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
