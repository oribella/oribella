export class Ensure {
  constructor(fns) {
    this.fns = fns;
  }
  ensure(o) {
    this.fns.forEach(key => {
      if(typeof o[key] !== "function") {
        o[key] = function() {};
      }
    });
  }
}

const DefaultGestureOptions = {
  touches: 1,
  which: 1,
  prio: 100
};

export class Registry {
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
      defaultOptionsPropertyDescriptors = Object.getOwnPropertyDescriptors(defaultOptions);
    }
    defaultOptions = Object.create(DefaultGestureOptions, defaultOptionsPropertyDescriptors);
    const optionsPropertyDescriptors = Object.getOwnPropertyDescriptors(subscriber.options);
    subscriber.options = Object.create(defaultOptions, optionsPropertyDescriptors);
    let gesture = new this.gestures[type](subscriber, element);
    return gesture;
  }
}
