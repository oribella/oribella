import {Flow} from "./flow";

export class MSPointerFlow extends Flow {
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
  normalizePoints(event, data, Point) {
    var ix = data.pointerIds.indexOf(event.pointerId);
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
