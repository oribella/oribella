import {Engine} from "./engine";
import {Registry} from "./registry";
import {MouseFlow} from "./flows/mouse";
import {TouchFlow} from "./flows/touch";
import {MSPointerFlow} from "./flows/ms-pointer";
import {PointerFlow} from "./flows/pointer";
import {Point} from "./point";

export class Oribella {
  constructor(element, config) {
    this.element = element;
    this.config = config;
    this.registry = new Registry();
    this.engine = new Engine(this.element,
      this.registry,
      this.isMouse.bind(this),
      this.isValidMouseButton.bind(this)
    );
  }
  activate() {
    return this.engine.activate();
  }
  withDefaultFlowStrategy() {
    if (this.config.msPointerEnabled) {
      this.engine.addFlow(new MSPointerFlow(this.element, Point));
      return this;
    }
    if (this.config.pointerEnabled) {
      this.engine.addFlow(new PointerFlow(this.element, Point));
      return this;
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
  isValidMouseButton(event, allowedBtn) {
    var btn = event.button,
      which = event.which,
      actualBtn;

    actualBtn = (!which && btn !== undefined) ?
                  (btn & 1 ? 1 : (btn & 2 ? 3 : (btn & 4 ? 2 : 0))) :
                  which;
    return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
      return actualBtn === val;
    }) : actualBtn === allowedBtn;
  }
}
