/*eslint no-underscore-dangle: 0*/
export var DefaultSubscriber = {
  down() {},
  start() {},
  update() {},
  end() {},
  cancel() {}
};
export var DefaultGesture = {
  start() {},
  update() {},
  end() {},
  cancel() {},
  bind() {},
  unbind() {}
};

export class Registry {
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
    this.ensureSubscriberOptions(defaultOptions, subscriber.options);
    var gesture = new this.gestures[type](subscriber, element);
    //gesture.__type__ = type;
    return gesture;
  }
  ensure(proto, defaultProto) {
    Object.keys(defaultProto).forEach(key => {
      if(typeof proto[key] !== typeof defaultProto[key]) {
        proto[key] = defaultProto[key];
      }
    });
  }
  ensureSubscriberProto(subscriber) {
    if (typeof subscriber !== "object") {
      throw new Error("Invalid parameter. Should be an object");
    }
    this.ensure(subscriber, DefaultSubscriber);
    subscriber.options = subscriber.options || {};
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
