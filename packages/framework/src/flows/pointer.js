import {Flow} from "./flow";

export class PointerFlow extends Flow {
  constructor(element) {
    super(element, [{
      start: ["pointerdown"]
  }, {
      update: ["pointermove"]
  }, {
      end: ["pointerup"]
  }, {
      cancel: ["pointercancel", "dragstart"]
  }]);
  }
  normalizePoints(event, data, Point) {

    if (ix < 0) {
      ix = data.pointerIds.push(event.pointerId) - 1;
    }
    data.pagePoints[ix] = new Point(event.pageX, event.pageY);
  }
  removePoints(event, data) {
    var ix = data.pointerIds.indexOf(event.pointerId);
    if(ix !== -1) {
      data.pointerIds.splice(ix, 1);
      data.pagePoints.splice(ix, 1);  
    }
  }
}
