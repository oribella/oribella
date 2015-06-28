/*eslint no-underscore-dangle: 0*/
export class GestureRegistry {
  constructor() {
    this.gestures = {};
  }
  register(type, Gesture) {
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
  getTypes() {
    return Object.keys(this.gestures);
  }
  create(type, subscriber, element) {
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
  ensureSubscriberProto(subscriber) {
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
  ensureSubscriberOptions(defaultOptions, options) {
    if (typeof defaultOptions === "undefined") {
      defaultOptions = {};
    }
    if (typeof defaultOptions.touches === "undefined") {
      defaultOptions.touches = 1;
    }
    if (typeof defaultOptions.which === "undefined") {
      defaultOptions.which = 1;
    }
    if (typeof defaultOptions.prio === "undefined") {
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
