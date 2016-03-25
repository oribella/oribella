export let Ensure = class Ensure {
  constructor(fns) {
    this.fns = fns;
  }
  ensure(o) {
    this.fns.forEach(key => {
      if (typeof o[key] !== "function") {
        o[key] = function () {};
      }
    });
  }
};

const DefaultGestureOptions = {
  touches: 1,
  which: 1,
  prio: 100
};

function getOwnPropertyDescriptors(src) {
  const descriptors = {};
  Object.getOwnPropertyNames(src).forEach(key => {
    descriptors[key] = Object.getOwnPropertyDescriptor(src, key);
  });
  return descriptors;
}

export let Registry = class Registry {
  constructor() {
    this.gestures = {};
    this.defaultGesture = new Ensure(["start", "update", "end", "cancel", "bind", "unbind"]);
    this.defaultSubscriber = new Ensure(["down", "start", "update", "end", "cancel"]);
  }
  register(type, Gesture) {
    this.defaultGesture.ensure(Gesture.prototype);
    this.gestures[type] = Gesture;
  }
  getTypes() {
    return Object.keys(this.gestures);
  }
  create(type, subscriber, element) {
    let defaultOptions = null;
    let defaultOptionsPropertyDescriptors = {};
    this.defaultSubscriber.ensure(subscriber);
    if (typeof this.gestures[type].defaultOptions === "function") {
      defaultOptions = this.gestures[type].defaultOptions();
      defaultOptionsPropertyDescriptors = getOwnPropertyDescriptors(defaultOptions);
    }
    defaultOptions = Object.create(DefaultGestureOptions, defaultOptionsPropertyDescriptors);
    const optionsPropertyDescriptors = getOwnPropertyDescriptors(subscriber.options);
    subscriber.options = Object.create(defaultOptions, optionsPropertyDescriptors);
    let gesture = new this.gestures[type](subscriber, element);
    return gesture;
  }
};
//# sourceMappingURL=registry.js.map