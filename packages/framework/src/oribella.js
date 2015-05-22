import {Engine} from "./engine";
import {GestureRegistry} from "./gesture-registry";
import {touchEnabled, msPointerEnabled, pointerEnabled} from "./utils";
import {MouseFlow} from "./flows/mouse";
import {TouchFlow} from "./flows/touch";
import {MSPointerFlow} from "./flows/ms-pointer";
import {PointerFlow} from "./flows/pointer";

export * from "./utils";

export class Oribella {
  constructor(element, engine) {
    this.element = element || window.document;
    this.registry = new GestureRegistry();
    this.engine = engine || (new Engine(this.element, this.registry));
  }
  activate() {
    return this.engine.activate();
  }
  withDefaultFlowStrategy() {
    if (msPointerEnabled) {
      this.engine.addFlow(new MSPointerFlow(this.element));
    }
    if (pointerEnabled) {
      this.engine.addFlow(new PointerFlow(this.element));
    }
    if (touchEnabled) {
      this.engine.addFlow(new TouchFlow(this.element));
    }

    this.engine.addFlow(new MouseFlow(this.element));
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
