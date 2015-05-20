System.register([], function (_export) {
  var _classCallCheck, _createClass, GestureRegistry;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      /*eslint no-underscore-dangle: 0*/

      GestureRegistry = (function () {
        function GestureRegistry() {
          _classCallCheck(this, GestureRegistry);

          this.gestures = {};
        }

        _createClass(GestureRegistry, [{
          key: "register",
          value: function register(type, Gesture) {
            var proto = Gesture.prototype;
            if (typeof proto.start === "undefined") {
              Object.defineProperty(proto, "start", {
                value: function start() {}
              });
            }
            if (typeof proto.update === "undefined") {
              Object.defineProperty(proto, "update", {
                value: function update() {}
              });
            }
            if (typeof proto.end === "undefined") {
              Object.defineProperty(proto, "end", {
                value: function end() {}
              });
            }
            if (typeof proto.cancel === "undefined") {
              Object.defineProperty(proto, "cancel", {
                value: function cancel() {}
              });
            }
            if (typeof proto.bind === "undefined") {
              Object.defineProperty(proto, "bind", {
                value: function bind() {}
              });
            }
            if (typeof proto.unbind === "undefined") {
              Object.defineProperty(proto, "unbind", {
                value: function unbind() {}
              });
            }
            this.gestures[type] = Gesture;
          }
        }, {
          key: "get",
          value: function get(type, subscriber, element) {
            var defaultOptions;
            this.ensureSubscriberProto(subscriber);
            if (typeof this.gestures[type].defaultOptions === "function") {
              defaultOptions = this.gestures[type].defaultOptions();
            }
            this.ensureSubscriberOptions(defaultOptions, subscriber.options);
            var gesture = new this.gestures[type](subscriber, element);
            gesture.__type = type;
            return gesture;
          }
        }, {
          key: "ensureSubscriberProto",
          value: function ensureSubscriberProto(subscriber) {
            if (typeof subscriber !== "object") {
              throw new Error("Invalid parameter. Should be an object");
            }
            if (typeof subscriber.down === "undefined") {
              Object.defineProperty(subscriber, "down", {
                value: function down() {}
              });
            }
            if (typeof subscriber.start === "undefined") {
              Object.defineProperty(subscriber, "start", {
                value: function start() {}
              });
            }
            if (typeof subscriber.update === "undefined") {
              Object.defineProperty(subscriber, "update", {
                value: function update() {}
              });
            }
            if (typeof subscriber.end === "undefined") {
              Object.defineProperty(subscriber, "end", {
                value: function end() {}
              });
            }
            if (typeof subscriber.cancel === "undefined") {
              Object.defineProperty(subscriber, "cancel", {
                value: function cancel() {}
              });
            }
            if (!subscriber.options) {
              Object.defineProperty(subscriber, "options", {
                value: {}
              });
            }
          }
        }, {
          key: "ensureSubscriberOptions",
          value: function ensureSubscriberOptions(defaultOptions, options) {
            if (typeof defaultOptions === "undefined") {
              defaultOptions = {};
            }
            if (typeof defaultOptions.touches === "undefined") {
              defaultOptions.touches = 1;
            }
            if (typeof defaultOptions.which === "undefined") {
              defaultOptions.which = 1;
            }
            if (typeof defaultOptions.which === "undefined") {
              defaultOptions.prio = 100;
            }
            Object.keys(defaultOptions).forEach(function (key) {
              var type = typeof options[key];
              if (type === "undefined" || type !== typeof defaultOptions[key]) {
                options[key] = defaultOptions[key];
              }
            });
          }
        }]);

        return GestureRegistry;
      })();

      _export("GestureRegistry", GestureRegistry);
    }
  };
});