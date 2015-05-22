"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _customAttribute$bindable$inject = require("aurelia-framework");

var Gesture = (function () {
  function Gesture(element, oribella, type) {
    _classCallCheck(this, Gesture);

    this.element = element;
    this.oribella = oribella;
    this.type = type;
  }

  _createClass(Gesture, [{
    key: "bind",
    value: function bind() {
      this.remove = this.oribella.on(this.element, this.type, {
        selector: this.selector,
        options: this.options,
        start: this.start,
        update: this.update,
        end: this.end,
        cancel: this.cancel,
        timeEnd: this.timeEnd
      });
    }
  }, {
    key: "unbind",
    value: function unbind() {
      this.remove();
    }
  }]);

  return Gesture;
})();

var Tap = (function (_Gesture) {
  function Tap(element, oribella) {
    _classCallCheck(this, _Tap);

    _get(Object.getPrototypeOf(Tap.prototype), "constructor", this).call(this, element, oribella, "tap");
  }

  _inherits(Tap, _Gesture);

  var _Tap = Tap;
  Tap = _customAttribute$bindable$inject.customAttribute("tap")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.inject(Element, "oribella")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.bindable("selector")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.bindable("options")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.bindable("start")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.bindable("update")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.bindable("end")(Tap) || Tap;
  Tap = _customAttribute$bindable$inject.bindable("cancel")(Tap) || Tap;
  return Tap;
})(Gesture);

var Doubletap = (function (_Gesture2) {
  function Doubletap(element, oribella) {
    _classCallCheck(this, _Doubletap);

    _get(Object.getPrototypeOf(Doubletap.prototype), "constructor", this).call(this, element, oribella, "doubletap");
  }

  _inherits(Doubletap, _Gesture2);

  var _Doubletap = Doubletap;
  Doubletap = _customAttribute$bindable$inject.customAttribute("doubletap")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.inject(Element, "oribella")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.bindable("selector")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.bindable("options")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.bindable("start")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.bindable("update")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.bindable("end")(Doubletap) || Doubletap;
  Doubletap = _customAttribute$bindable$inject.bindable("cancel")(Doubletap) || Doubletap;
  return Doubletap;
})(Gesture);

var Longtap = (function (_Gesture3) {
  function Longtap(element, oribella) {
    _classCallCheck(this, _Longtap);

    _get(Object.getPrototypeOf(Longtap.prototype), "constructor", this).call(this, element, oribella, "longtap");
  }

  _inherits(Longtap, _Gesture3);

  var _Longtap = Longtap;
  Longtap = _customAttribute$bindable$inject.customAttribute("longtap")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.inject(Element, "oribella")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("selector")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("options")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("start")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("update")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("end")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("cancel")(Longtap) || Longtap;
  Longtap = _customAttribute$bindable$inject.bindable("timeEnd")(Longtap) || Longtap;
  return Longtap;
})(Gesture);

var Swipe = (function (_Gesture4) {
  function Swipe(element, oribella) {
    _classCallCheck(this, _Swipe);

    _get(Object.getPrototypeOf(Swipe.prototype), "constructor", this).call(this, element, oribella, "swipe");
  }

  _inherits(Swipe, _Gesture4);

  var _Swipe = Swipe;
  Swipe = _customAttribute$bindable$inject.customAttribute("swipe")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.inject(Element, "oribella")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.bindable("selector")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.bindable("options")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.bindable("start")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.bindable("update")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.bindable("end")(Swipe) || Swipe;
  Swipe = _customAttribute$bindable$inject.bindable("cancel")(Swipe) || Swipe;
  return Swipe;
})(Gesture);

var LongtapSwipe = (function (_Gesture5) {
  function LongtapSwipe(element, oribella) {
    _classCallCheck(this, _LongtapSwipe);

    _get(Object.getPrototypeOf(LongtapSwipe.prototype), "constructor", this).call(this, element, oribella, "longtapswipe");
  }

  _inherits(LongtapSwipe, _Gesture5);

  var _LongtapSwipe = LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.customAttribute("longtap-swipe")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.inject(Element, "oribella")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.bindable("selector")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.bindable("options")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.bindable("start")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.bindable("update")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.bindable("end")(LongtapSwipe) || LongtapSwipe;
  LongtapSwipe = _customAttribute$bindable$inject.bindable("cancel")(LongtapSwipe) || LongtapSwipe;
  return LongtapSwipe;
})(Gesture);

var Pinch = (function (_Gesture6) {
  function Pinch(element, oribella) {
    _classCallCheck(this, _Pinch);

    _get(Object.getPrototypeOf(Pinch.prototype), "constructor", this).call(this, element, oribella, "pinch");
  }

  _inherits(Pinch, _Gesture6);

  var _Pinch = Pinch;
  Pinch = _customAttribute$bindable$inject.customAttribute("pinch")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.inject(Element, "oribella")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.bindable("selector")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.bindable("options")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.bindable("start")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.bindable("update")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.bindable("end")(Pinch) || Pinch;
  Pinch = _customAttribute$bindable$inject.bindable("cancel")(Pinch) || Pinch;
  return Pinch;
})(Gesture);

var Rotate = (function (_Gesture7) {
  function Rotate(element, oribella) {
    _classCallCheck(this, _Rotate);

    _get(Object.getPrototypeOf(Rotate.prototype), "constructor", this).call(this, element, oribella, "rotate");
  }

  _inherits(Rotate, _Gesture7);

  var _Rotate = Rotate;
  Rotate = _customAttribute$bindable$inject.customAttribute("rotate")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.inject(Element, "oribella")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.bindable("selector")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.bindable("options")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.bindable("start")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.bindable("update")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.bindable("end")(Rotate) || Rotate;
  Rotate = _customAttribute$bindable$inject.bindable("cancel")(Rotate) || Rotate;
  return Rotate;
})(Gesture);