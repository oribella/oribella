"use strict";

System.register([], function (_export) {
  var DefaultSubscriber, DefaultGesture;
  return {
    setters: [],
    execute: function () {
      _export("DefaultSubscriber", DefaultSubscriber = {
        down() {},

        start() {},

        update() {},

        end() {},

        cancel() {}

      });

      _export("DefaultSubscriber", DefaultSubscriber);

      _export("DefaultGesture", DefaultGesture = {
        start() {},

        update() {},

        end() {},

        cancel() {},

        bind() {},

        unbind() {}

      });

      _export("DefaultGesture", DefaultGesture);

      class Registry {
        constructor() {
          this.gestures = {};
        }

        register(type, Gesture) {
          this.ensure(Gesture.prototype, DefaultGesture);
          this.gestures[type] = Gesture;
        }

        getTypes() {
          return Object.keys(this.gestures);
        }

        create(type, subscriber, element) {
          var defaultOptions;
          this.ensureSubscriberProto(subscriber);

          if (typeof this.gestures[type].defaultOptions === "function") {
            defaultOptions = this.gestures[type].defaultOptions();
          }

          if (typeof subscriber.options === "undefined") {
            subscriber.options = {};
          }

          this.ensureSubscriberOptions(defaultOptions, subscriber.options);
          var gesture = new this.gestures[type](subscriber, element);
          return gesture;
        }

        ensure(proto, defaultProto) {
          Object.keys(defaultProto).forEach(key => {
            if (typeof proto[key] !== typeof defaultProto[key]) {
              proto[key] = defaultProto[key];
            }
          });
        }

        ensureSubscriberProto(subscriber) {
          if (typeof subscriber !== "object") {
            throw new Error("Invalid parameter. Should be an object");
          }

          this.ensure(subscriber, DefaultSubscriber);
        }

        ensureSubscriberOptions(defaultOptions, options) {
          if (typeof defaultOptions === "undefined") {
            defaultOptions = {};
          }

          if (typeof defaultOptions.touches !== "number") {
            defaultOptions.touches = 1;
          }

          if (typeof defaultOptions.which !== "number") {
            defaultOptions.which = 1;
          }

          if (typeof defaultOptions.prio !== "number") {
            defaultOptions.prio = 100;
          }

          Object.keys(defaultOptions).forEach(key => {
            var type = typeof options[key];

            if (type === "undefined" || type !== typeof defaultOptions[key]) {
              options[key] = defaultOptions[key];
            }
          });
        }

      }

      _export("Registry", Registry);
    }
  };
});