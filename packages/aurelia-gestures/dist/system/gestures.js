System.register(["aurelia-framework"], function (_export) {
  var customAttribute, bindable, inject, _get, _inherits, _classCallCheck, _createClass, Gesture, Tap, Doubletap, Longtap, Swipe, LongtapSwipe, Pinch, Rotate;

  return {
    setters: [function (_aureliaFramework) {
      customAttribute = _aureliaFramework.customAttribute;
      bindable = _aureliaFramework.bindable;
      inject = _aureliaFramework.inject;
    }],
    execute: function () {
      "use strict";

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Gesture = (function () {
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

      Tap = (function (_Gesture) {
        function Tap(element, oribella) {
          _classCallCheck(this, _Tap);

          _get(Object.getPrototypeOf(Tap.prototype), "constructor", this).call(this, element, oribella, "tap");
        }

        _inherits(Tap, _Gesture);

        var _Tap = Tap;
        Tap = customAttribute("tap")(Tap) || Tap;
        Tap = inject(Element, "oribella")(Tap) || Tap;
        Tap = bindable("selector")(Tap) || Tap;
        Tap = bindable("options")(Tap) || Tap;
        Tap = bindable("start")(Tap) || Tap;
        Tap = bindable("update")(Tap) || Tap;
        Tap = bindable("end")(Tap) || Tap;
        Tap = bindable("cancel")(Tap) || Tap;
        return Tap;
      })(Gesture);

      Doubletap = (function (_Gesture2) {
        function Doubletap(element, oribella) {
          _classCallCheck(this, _Doubletap);

          _get(Object.getPrototypeOf(Doubletap.prototype), "constructor", this).call(this, element, oribella, "doubletap");
        }

        _inherits(Doubletap, _Gesture2);

        var _Doubletap = Doubletap;
        Doubletap = customAttribute("doubletap")(Doubletap) || Doubletap;
        Doubletap = inject(Element, "oribella")(Doubletap) || Doubletap;
        Doubletap = bindable("selector")(Doubletap) || Doubletap;
        Doubletap = bindable("options")(Doubletap) || Doubletap;
        Doubletap = bindable("start")(Doubletap) || Doubletap;
        Doubletap = bindable("update")(Doubletap) || Doubletap;
        Doubletap = bindable("end")(Doubletap) || Doubletap;
        Doubletap = bindable("cancel")(Doubletap) || Doubletap;
        return Doubletap;
      })(Gesture);

      Longtap = (function (_Gesture3) {
        function Longtap(element, oribella) {
          _classCallCheck(this, _Longtap);

          _get(Object.getPrototypeOf(Longtap.prototype), "constructor", this).call(this, element, oribella, "longtap");
        }

        _inherits(Longtap, _Gesture3);

        var _Longtap = Longtap;
        Longtap = customAttribute("longtap")(Longtap) || Longtap;
        Longtap = inject(Element, "oribella")(Longtap) || Longtap;
        Longtap = bindable("selector")(Longtap) || Longtap;
        Longtap = bindable("options")(Longtap) || Longtap;
        Longtap = bindable("start")(Longtap) || Longtap;
        Longtap = bindable("update")(Longtap) || Longtap;
        Longtap = bindable("end")(Longtap) || Longtap;
        Longtap = bindable("cancel")(Longtap) || Longtap;
        Longtap = bindable("timeEnd")(Longtap) || Longtap;
        return Longtap;
      })(Gesture);

      Swipe = (function (_Gesture4) {
        function Swipe(element, oribella) {
          _classCallCheck(this, _Swipe);

          _get(Object.getPrototypeOf(Swipe.prototype), "constructor", this).call(this, element, oribella, "swipe");
        }

        _inherits(Swipe, _Gesture4);

        var _Swipe = Swipe;
        Swipe = customAttribute("swipe")(Swipe) || Swipe;
        Swipe = inject(Element, "oribella")(Swipe) || Swipe;
        Swipe = bindable("selector")(Swipe) || Swipe;
        Swipe = bindable("options")(Swipe) || Swipe;
        Swipe = bindable("start")(Swipe) || Swipe;
        Swipe = bindable("update")(Swipe) || Swipe;
        Swipe = bindable("end")(Swipe) || Swipe;
        Swipe = bindable("cancel")(Swipe) || Swipe;
        return Swipe;
      })(Gesture);

      LongtapSwipe = (function (_Gesture5) {
        function LongtapSwipe(element, oribella) {
          _classCallCheck(this, _LongtapSwipe);

          _get(Object.getPrototypeOf(LongtapSwipe.prototype), "constructor", this).call(this, element, oribella, "longtapswipe");
        }

        _inherits(LongtapSwipe, _Gesture5);

        var _LongtapSwipe = LongtapSwipe;
        LongtapSwipe = customAttribute("longtap-swipe")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = inject(Element, "oribella")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = bindable("selector")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = bindable("options")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = bindable("start")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = bindable("update")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = bindable("end")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = bindable("cancel")(LongtapSwipe) || LongtapSwipe;
        return LongtapSwipe;
      })(Gesture);

      Pinch = (function (_Gesture6) {
        function Pinch(element, oribella) {
          _classCallCheck(this, _Pinch);

          _get(Object.getPrototypeOf(Pinch.prototype), "constructor", this).call(this, element, oribella, "pinch");
        }

        _inherits(Pinch, _Gesture6);

        var _Pinch = Pinch;
        Pinch = customAttribute("pinch")(Pinch) || Pinch;
        Pinch = inject(Element, "oribella")(Pinch) || Pinch;
        Pinch = bindable("selector")(Pinch) || Pinch;
        Pinch = bindable("options")(Pinch) || Pinch;
        Pinch = bindable("start")(Pinch) || Pinch;
        Pinch = bindable("update")(Pinch) || Pinch;
        Pinch = bindable("end")(Pinch) || Pinch;
        Pinch = bindable("cancel")(Pinch) || Pinch;
        return Pinch;
      })(Gesture);

      Rotate = (function (_Gesture7) {
        function Rotate(element, oribella) {
          _classCallCheck(this, _Rotate);

          _get(Object.getPrototypeOf(Rotate.prototype), "constructor", this).call(this, element, oribella, "rotate");
        }

        _inherits(Rotate, _Gesture7);

        var _Rotate = Rotate;
        Rotate = customAttribute("rotate")(Rotate) || Rotate;
        Rotate = inject(Element, "oribella")(Rotate) || Rotate;
        Rotate = bindable("selector")(Rotate) || Rotate;
        Rotate = bindable("options")(Rotate) || Rotate;
        Rotate = bindable("start")(Rotate) || Rotate;
        Rotate = bindable("update")(Rotate) || Rotate;
        Rotate = bindable("end")(Rotate) || Rotate;
        Rotate = bindable("cancel")(Rotate) || Rotate;
        return Rotate;
      })(Gesture);
    }
  };
});