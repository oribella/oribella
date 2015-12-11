"use strict";

System.register(["./flow"], function (_export) {
  var Flow;
  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      class TouchFlow extends Flow {
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

      _export("TouchFlow", TouchFlow);
    }
  };
});