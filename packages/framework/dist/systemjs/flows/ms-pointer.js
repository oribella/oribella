"use strict";

System.register(["./pointer"], function (_export) {
  var PointerFlow;
  return {
    setters: [function (_pointer) {
      PointerFlow = _pointer.PointerFlow;
    }],
    execute: function () {
      class MSPointerFlow extends PointerFlow {
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

      }

      _export("MSPointerFlow", MSPointerFlow);
    }
  };
});