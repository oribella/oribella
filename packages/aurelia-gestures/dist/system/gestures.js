System.register(["aurelia-framework"], function (_export) {
  "use strict";

  var customAttribute, bindable, inject, Gesture, Tap, Doubletap, Longtap, Swipe, LongtapSwipe, Pinch, Rotate;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_aureliaFramework) {
      customAttribute = _aureliaFramework.customAttribute;
      bindable = _aureliaFramework.bindable;
      inject = _aureliaFramework.inject;
    }],
    execute: function () {
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
        var _instanceInitializers = {};

        function Tap(element, oribella) {
          _classCallCheck(this, _Tap);

          _get(Object.getPrototypeOf(_Tap.prototype), "constructor", this).call(this, element, oribella, "tap");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers);
        }

        _inherits(Tap, _Gesture);

        var _Tap = Tap;

        _createDecoratedClass(_Tap, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers);

        Tap = inject(Element, "oribella")(Tap) || Tap;
        Tap = customAttribute("tap")(Tap) || Tap;
        return Tap;
      })(Gesture);

      _export("Tap", Tap);

      Doubletap = (function (_Gesture2) {
        var _instanceInitializers2 = {};

        function Doubletap(element, oribella) {
          _classCallCheck(this, _Doubletap);

          _get(Object.getPrototypeOf(_Doubletap.prototype), "constructor", this).call(this, element, oribella, "doubletap");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers2);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers2);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers2);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers2);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers2);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers2);
        }

        _inherits(Doubletap, _Gesture2);

        var _Doubletap = Doubletap;

        _createDecoratedClass(_Doubletap, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers2);

        Doubletap = inject(Element, "oribella")(Doubletap) || Doubletap;
        Doubletap = customAttribute("doubletap")(Doubletap) || Doubletap;
        return Doubletap;
      })(Gesture);

      _export("Doubletap", Doubletap);

      Longtap = (function (_Gesture3) {
        var _instanceInitializers3 = {};

        function Longtap(element, oribella) {
          _classCallCheck(this, _Longtap);

          _get(Object.getPrototypeOf(_Longtap.prototype), "constructor", this).call(this, element, oribella, "longtap");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers3);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers3);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers3);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers3);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers3);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers3);

          _defineDecoratedPropertyDescriptor(this, "timeEnd", _instanceInitializers3);
        }

        _inherits(Longtap, _Gesture3);

        var _Longtap = Longtap;

        _createDecoratedClass(_Longtap, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "timeEnd",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers3);

        Longtap = inject(Element, "oribella")(Longtap) || Longtap;
        Longtap = customAttribute("longtap")(Longtap) || Longtap;
        return Longtap;
      })(Gesture);

      _export("Longtap", Longtap);

      Swipe = (function (_Gesture4) {
        var _instanceInitializers4 = {};

        function Swipe(element, oribella) {
          _classCallCheck(this, _Swipe);

          _get(Object.getPrototypeOf(_Swipe.prototype), "constructor", this).call(this, element, oribella, "swipe");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers4);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers4);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers4);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers4);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers4);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers4);
        }

        _inherits(Swipe, _Gesture4);

        var _Swipe = Swipe;

        _createDecoratedClass(_Swipe, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers4);

        Swipe = inject(Element, "oribella")(Swipe) || Swipe;
        Swipe = customAttribute("swipe")(Swipe) || Swipe;
        return Swipe;
      })(Gesture);

      _export("Swipe", Swipe);

      LongtapSwipe = (function (_Gesture5) {
        var _instanceInitializers5 = {};

        function LongtapSwipe(element, oribella) {
          _classCallCheck(this, _LongtapSwipe);

          _get(Object.getPrototypeOf(_LongtapSwipe.prototype), "constructor", this).call(this, element, oribella, "longtapswipe");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers5);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers5);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers5);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers5);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers5);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers5);
        }

        _inherits(LongtapSwipe, _Gesture5);

        var _LongtapSwipe = LongtapSwipe;

        _createDecoratedClass(_LongtapSwipe, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers5);

        LongtapSwipe = inject(Element, "oribella")(LongtapSwipe) || LongtapSwipe;
        LongtapSwipe = customAttribute("longtap-swipe")(LongtapSwipe) || LongtapSwipe;
        return LongtapSwipe;
      })(Gesture);

      _export("LongtapSwipe", LongtapSwipe);

      Pinch = (function (_Gesture6) {
        var _instanceInitializers6 = {};

        function Pinch(element, oribella) {
          _classCallCheck(this, _Pinch);

          _get(Object.getPrototypeOf(_Pinch.prototype), "constructor", this).call(this, element, oribella, "pinch");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers6);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers6);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers6);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers6);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers6);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers6);
        }

        _inherits(Pinch, _Gesture6);

        var _Pinch = Pinch;

        _createDecoratedClass(_Pinch, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers6);

        Pinch = inject(Element, "oribella")(Pinch) || Pinch;
        Pinch = customAttribute("pinch")(Pinch) || Pinch;
        return Pinch;
      })(Gesture);

      _export("Pinch", Pinch);

      Rotate = (function (_Gesture7) {
        var _instanceInitializers7 = {};

        function Rotate(element, oribella) {
          _classCallCheck(this, _Rotate);

          _get(Object.getPrototypeOf(_Rotate.prototype), "constructor", this).call(this, element, oribella, "rotate");

          _defineDecoratedPropertyDescriptor(this, "selector", _instanceInitializers7);

          _defineDecoratedPropertyDescriptor(this, "options", _instanceInitializers7);

          _defineDecoratedPropertyDescriptor(this, "start", _instanceInitializers7);

          _defineDecoratedPropertyDescriptor(this, "update", _instanceInitializers7);

          _defineDecoratedPropertyDescriptor(this, "end", _instanceInitializers7);

          _defineDecoratedPropertyDescriptor(this, "cancel", _instanceInitializers7);
        }

        _inherits(Rotate, _Gesture7);

        var _Rotate = Rotate;

        _createDecoratedClass(_Rotate, [{
          key: "selector",
          decorators: [bindable],
          initializer: function initializer() {
            return undefined;
          },
          enumerable: true
        }, {
          key: "options",
          decorators: [bindable],
          initializer: function initializer() {
            return {};
          },
          enumerable: true
        }, {
          key: "start",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "update",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "end",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }, {
          key: "cancel",
          decorators: [bindable],
          initializer: function initializer() {
            return function () {};
          },
          enumerable: true
        }], null, _instanceInitializers7);

        Rotate = inject(Element, "oribella")(Rotate) || Rotate;
        Rotate = customAttribute("rotate")(Rotate) || Rotate;
        return Rotate;
      })(Gesture);

      _export("Rotate", Rotate);
    }
  };
});