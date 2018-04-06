System.register(["./utils"], function (_export) {
  "use strict";

  var isMouse, Validator;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_utils) {
      isMouse = _utils.isMouse;
    }],
    execute: function () {
      Validator = (function () {
        function Validator() {
          _classCallCheck(this, Validator);
        }

        _createClass(Validator, [{
          key: "isValidMouseButton",
          value: function isValidMouseButton(event, allowedBtn) {
            var btn = event.button,
                which = event.which,
                actualBtn;

            actualBtn = !which && btn !== undefined ? btn & 1 ? 1 : btn & 2 ? 3 : btn & 4 ? 2 : 0 : which;
            return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
              return actualBtn === val;
            }) : actualBtn === allowedBtn;
          }
        }, {
          key: "hasMoreTouches",
          value: function hasMoreTouches(pagePoints, touches) {
            return pagePoints.length > touches;
          }
        }, {
          key: "hasEqualTouches",
          value: function hasEqualTouches(pagePoints, touches) {
            return pagePoints.length === touches;
          }
        }, {
          key: "start",
          value: function start(e, data, options) {
            if (isMouse(e) && !this.isValidMouseButton(e, options.which)) {
              return false;
            }
            if (this.hasMoreTouches(data.pagePoints, options.touches)) {
              return false;
            }
            return true;
          }
        }, {
          key: "update",
          value: function update(e, data, options) {
            if (this.hasMoreTouches(data.pagePoints, options.touches)) {
              return false;
            }
            if (this.hasEqualTouches(data.pagePoints, options.touches)) {
              return true;
            }
            return undefined;
          }
        }, {
          key: "end",
          value: function end(e, data, options) {
            return this.hasEqualTouches(data.pagePoints, options.touches);
          }
        }]);

        return Validator;
      })();

      _export("Validator", Validator);
    }
  };
});