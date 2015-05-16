"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Handler = (function () {
  function Handler(element, type, subscriber, active) {
    _classCallCheck(this, Handler);

    this.element = element;
    this.type = type;
    this.subscriber = subscriber;
    this.active = active;
  }

  _createClass(Handler, null, [{
    key: "create",
    value: function create(element, type, subscriber) {
      return new Handler(element, type, subscriber);
    }
  }]);

  return Handler;
})();

exports.Handler = Handler;