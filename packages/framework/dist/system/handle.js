System.register([], function (_export) {
  var _classCallCheck, Handle;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Handle = function Handle(element, type, subscriber, active) {
        _classCallCheck(this, Handle);

        this.element = element;
        this.type = type;
        this.subscriber = subscriber;
        this.active = active;
      };

      _export("Handle", Handle);
    }
  };
});