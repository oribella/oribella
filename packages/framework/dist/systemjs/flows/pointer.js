"use strict";

System.register(["./flow"], function (_export) {
  var Flow, _createClass, PointerFlow;

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
      _createClass = (function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      _export("PointerFlow", PointerFlow = (function (_Flow) {
        _inherits(PointerFlow, _Flow);

        function PointerFlow(element, Point) {
          _classCallCheck(this, PointerFlow);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(PointerFlow).call(this, element, Point, [{
            start: ["pointerdown"]
          }, {
            update: ["pointermove"]
          }, {
            end: ["pointerup"]
          }, {
            cancel: ["pointercancel", "dragstart"]
          }]));
        }

        _createClass(PointerFlow, [{
          key: "normalizePoints",
          value: function normalizePoints(event, Point) {
            this.currentPointers = {};
            this.currentPointers[event.pointerId] = new Point(event.pageX, event.pageY);

            switch (event.type) {
              case "pointerdown":
              case "pointermove":
                this.allPointers[event.pointerId] = new Point(event.pageX, event.pageY);
                break;

              default:
                delete this.allPointers[event.pointerId];
                break;
            }
          }
        }]);

        return PointerFlow;
      })(Flow));

      _export("PointerFlow", PointerFlow);
    }
  };
});