System.register(["./flow"], function (_export) {
  var Flow, _classCallCheck, _get, _inherits, MouseFlow;

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      MouseFlow = (function (_Flow) {
        function MouseFlow(element) {
          _classCallCheck(this, MouseFlow);

          _get(Object.getPrototypeOf(MouseFlow.prototype), "constructor", this).call(this, element, [{
            start: ["mousedown"]
          }, {
            update: ["mousemove"]
          }, {
            end: ["mouseup"]
          }, {
            cancel: ["dragstart"]
          }], false);
        }

        _inherits(MouseFlow, _Flow);

        return MouseFlow;
      })(Flow);

      _export("MouseFlow", MouseFlow);
    }
  };
});