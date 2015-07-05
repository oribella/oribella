import {Engine} from "./engine";
import {Registry} from "./registry";
import {touchEnabled, msPointerEnabled, pointerEnabled} from "./utils";
import {MouseFlow} from "./flows/mouse";
import {TouchFlow} from "./flows/touch";
import {MSPointerFlow} from "./flows/ms-pointer";
import {PointerFlow} from "./flows/pointer";
import {Point} from "./point";

export * from "./utils";

export class Oribella {
  constructor(element, engine) {
    this.element = element || window.document;
    this.registry = new Registry();
    this.engine = engine || (new Engine(this.element, this.registry));
  }
  activate() {
    return this.engine.activate();
  }
  withDefaultFlowStrategy() {
    if (msPointerEnabled) {
      this.engine.addFlow(new MSPointerFlow(this.element, Point));
    }
    if (pointerEnabled) {
      this.engine.addFlow(new PointerFlow(this.element, Point));
    }
    if (touchEnabled) {
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
}
