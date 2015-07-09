import {Engine} from "./engine";
import {Validator} from "./validator";
import {Registry} from "./registry";
import {MouseFlow} from "./flows/mouse";
import {TouchFlow} from "./flows/touch";
import {MSPointerFlow} from "./flows/ms-pointer";
import {PointerFlow} from "./flows/pointer";
import {Point} from "./point";

export * from "./utils";

export class Oribella {
  constructor(element, engine, config) {
    this.element = element || window.document;
    this.registry = new Registry();
    this.engine = engine || (new Engine(this.element, this.registry, new Validator(this.isMouse.bind(this))));
    this.config = config || {
      touchEnabled: !!("ontouchstart" in window),
      msPointerEnabled: !!(window.MSPointerEvent),
      pointerEnabled: !!(window.PointerEvent)
    };
  }
  activate() {
    return this.engine.activate();
  }
  withDefaultFlowStrategy() {
    if (this.config.msPointerEnabled) {
      this.engine.addFlow(new MSPointerFlow(this.element, Point));
    }
    if (this.config.pointerEnabled) {
      this.engine.addFlow(new PointerFlow(this.element, Point));
    }
    if (this.config.touchEnabled) {
      this.engine.addFlow(new TouchFlow(this.element, Point));
    }

    this.engine.addFlow(new MouseFlow(this.element, Point));
    return this;
  }
  registerGesture(type, Gesture) {
    this.engine.registerGesture(type, Gesture);
    return this;
  }
  on(element, type, subscriber) {
    return this.engine.addHandle(element, type, subscriber);
  }
  isMouse(e) {
    if (this.config.msPointerEnabled && e.pointerType === e.MSPOINTER_TYPE_MOUSE) { //IE10
      return true;
    }
    if (this.config.pointerEnabled && e.pointerType === "mouse") { //IE11
      return true;
    }
    if (e.type.indexOf("mouse") !== -1) {
      return true;
    }
    return false;
  }
}
