System.register([], function (_export) {
  "use strict";

  var Handle;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
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