"use strict";

System.register(["./flow"], function (_export, _context) {
  var Flow, MouseFlow;

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
      _export("MouseFlow", MouseFlow = function (_Flow) {
        _inherits(MouseFlow, _Flow);

        function MouseFlow(element, Point) {
          _classCallCheck(this, MouseFlow);

          return _possibleConstructorReturn(this, _Flow.call(this, element, Point, [{
            start: ["mousedown"]
          }, {
            update: ["mousemove"]
          }, {
            end: ["mouseup"]
          }, {
            cancel: ["dragstart", "contextmenu"]
          }], false));
        }

        MouseFlow.prototype.normalizePoints = function normalizePoints(event, Point) {
          switch (event.type) {
            case "mousedown":
            case "mousemove":
              this.allPointers = this.currentPointers = {
                1: {
                  page: new Point(event.pageX, event.pageY),
                  client: new Point(event.clientX, event.clientY)
                }
              };
              break;
            default:
              this.allPointers = {};
              break;
          }
        };

        return MouseFlow;
      }(Flow));

      _export("MouseFlow", MouseFlow);
    }
  };
});
//# sourceMappingURL=mouse.js.map