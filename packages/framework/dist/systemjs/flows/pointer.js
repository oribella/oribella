"use strict";

System.register(["./flow"], function (_export, _context) {
  var Flow, PointerFlow;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      _export("PointerFlow", PointerFlow = function (_Flow) {
        _inherits(PointerFlow, _Flow);

        function PointerFlow(element, Point) {
          _classCallCheck(this, PointerFlow);

          return _possibleConstructorReturn(this, _Flow.call(this, element, Point, [{
            start: ["pointerdown"]
          }, {
            update: ["pointermove"]
          }, {
            end: ["pointerup"]
          }, {
            cancel: ["pointercancel", "dragstart"]
          }]));
        }

        PointerFlow.prototype.normalizePoints = function normalizePoints(event, Point) {
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
        };

        return PointerFlow;
      }(Flow));

      _export("PointerFlow", PointerFlow);
    }
  };
});
//# sourceMappingURL=pointer.js.map