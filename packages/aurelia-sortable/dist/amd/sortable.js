define(["exports", "aurelia-pal", "aurelia-templating", "aurelia-dependency-injection", "oribella-default-gestures", "./drag", "./auto-scroll"], function (exports, _aureliaPal, _aureliaTemplating, _aureliaDependencyInjection, _oribellaDefaultGestures, _drag, _autoScroll) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

  var SORTABLE_ITEM = "oa-sortable-item";

  var Sortable = (function () {
    var _instanceInitializers = {};
    var _instanceInitializers = {};

    _createDecoratedClass(Sortable, [{
      key: "scroll",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return null;
      },
      enumerable: true
    }, {
      key: "scrollSpeed",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return 10;
      },
      enumerable: true
    }, {
      key: "scrollSensitivity",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return 10;
      },
      enumerable: true
    }, {
      key: "items",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return [];
      },
      enumerable: true
    }, {
      key: "sortingClass",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return "oa-sorting";
      },
      enumerable: true
    }, {
      key: "draggingClass",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return "oa-dragging";
      },
      enumerable: true
    }, {
      key: "axis",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return "";
      },
      enumerable: true
    }, {
      key: "moved",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return function () {};
      },
      enumerable: true
    }, {
      key: "dragZIndex",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return 1;
      },
      enumerable: true
    }, {
      key: "disallowedDragTagNames",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return ["INPUT", "SELECT", "TEXTAREA"];
      },
      enumerable: true
    }, {
      key: "allowDrag",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        var _this = this;

        return function (args) {
          if (_this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
            return false;
          }
          if (args.event.target.isContentEditable) {
            return false;
          }
          return true;
        };
      },
      enumerable: true
    }, {
      key: "allowMove",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return function () {
          return true;
        };
      },
      enumerable: true
    }], null, _instanceInitializers);

    function Sortable(element, drag, autoScroll) {
      _classCallCheck(this, _Sortable);

      _defineDecoratedPropertyDescriptor(this, "scroll", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "scrollSpeed", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "scrollSensitivity", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "items", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "sortingClass", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "draggingClass", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "axis", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "moved", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "dragZIndex", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "disallowedDragTagNames", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "allowDrag", _instanceInitializers);

      _defineDecoratedPropertyDescriptor(this, "allowMove", _instanceInitializers);

      this.selector = "[" + SORTABLE_ITEM + "]";
      this.fromIx = -1;
      this.toIx = -1;
      this.x = 0;
      this.y = 0;
      this.lastElementFromPointRect = null;

      this.element = element;
      this.drag = drag;
      this.autoScroll = autoScroll;
      this.options = {
        strategy: _oribellaDefaultGestures.STRATEGY_FLAG.REMOVE_IF_POINTERS_GT
      };
    }

    _createDecoratedClass(Sortable, [{
      key: "activate",
      value: function activate() {
        this.removeListener = _oribellaDefaultGestures.oribella.on(this.element, "swipe", this);
        var scroll = this.scroll;
        if (typeof scroll === "string") {
          if (scroll === "document") {
            this.scroll = document.scrollingElement || document.documentElement || document.body;
            this.viewportScroll = true;
            this.removeScroll = this.bindScroll(document, this.onScroll.bind(this));
            return;
          } else {
            scroll = this.closest(this.element, scroll);
          }
        }
        this.scroll = scroll;
        if (!(this.scroll instanceof _aureliaPal.DOM.Element)) {
          this.scroll = this.element;
        }
        this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
      }
    }, {
      key: "deactivate",
      value: function deactivate() {
        if (typeof this.removeListener === "function") {
          this.removeListener();
        }
        if (typeof this.removeScroll === "function") {
          this.removeScroll();
        }
      }
    }, {
      key: "attached",
      value: function attached() {
        this.activate();
      }
    }, {
      key: "detached",
      value: function detached() {
        this.deactivate();
      }
    }, {
      key: "bindScroll",
      value: function bindScroll(scroll, fn) {
        scroll.addEventListener("scroll", fn, false);
        return function () {
          scroll.removeEventListener("scroll", fn, false);
        };
      }
    }, {
      key: "onScroll",
      value: function onScroll() {
        if (!this.drag.element) {
          return;
        }
        var _scroll = this.scroll;
        var scrollLeft = _scroll.scrollLeft;
        var scrollTop = _scroll.scrollTop;

        this.drag.update(this.x, this.y, this.viewportScroll, scrollLeft, scrollTop, this.axis, this.dragMinPosX, this.dragMaxPosX, this.dragMinPosY, this.dragMaxPosY);

        var _getPoint = this.getPoint(this.x, this.y);

        var x = _getPoint.x;
        var y = _getPoint.y;

        this.tryMove(x, y, scrollLeft, scrollTop);
      }
    }, {
      key: "getScrollFrames",
      value: function getScrollFrames(maxPos, scrollPos) {
        return Math.max(0, Math.ceil(Math.abs(maxPos - scrollPos) / this.scrollSpeed));
      }
    }, {
      key: "getScrollDirectionX",
      value: function getScrollDirectionX(x, _ref) {
        var left = _ref.left;
        var right = _ref.right;

        var dir = 0;
        switch (this.axis) {
          default:
          case "x":
            if (x >= right - this.scrollSensitivity) {
              dir = 1;
            } else if (x <= left + this.scrollSensitivity) {
              dir = -1;
            }
            break;
        }
        return dir;
      }
    }, {
      key: "getScrollDirectionY",
      value: function getScrollDirectionY(y, _ref2) {
        var top = _ref2.top;
        var bottom = _ref2.bottom;

        var dir = 0;
        switch (this.axis) {
          default:
          case "y":
            if (y >= bottom - this.scrollSensitivity) {
              dir = 1;
            } else if (y <= top + this.scrollSensitivity) {
              dir = -1;
            }
            break;
        }
        return dir;
      }
    }, {
      key: "hide",
      value: function hide(element) {
        var display = element.style.display;
        element.style.display = "none";
        return function () {
          element.style.display = display;
        };
      }
    }, {
      key: "closest",
      value: function closest(element, selector) {
        var rootElement = arguments.length <= 2 || arguments[2] === undefined ? document : arguments[2];

        var valid = false;
        while (!valid && element !== null && element !== rootElement && element !== document) {
          valid = (0, _oribellaDefaultGestures.matchesSelector)(element, selector);
          if (valid) {
            break;
          }
          element = element.parentNode;
        }
        return valid ? element : null;
      }
    }, {
      key: "getItemViewModel",
      value: function getItemViewModel(element) {
        return element.au[SORTABLE_ITEM].viewModel;
      }
    }, {
      key: "moveSortingItem",
      value: function moveSortingItem(toIx) {
        var fromIx = this.items.indexOf(this.drag.item);
        this.move(fromIx, toIx);
      }
    }, {
      key: "move",
      value: function move(fromIx, toIx) {
        if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
          this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
        }
      }
    }, {
      key: "tryUpdate",
      value: function tryUpdate(x, y, offsetX, offsetY) {
        var showFn = this.hide(this.drag.clone);
        this.tryMove(x, y, offsetX, offsetY);
        showFn();
      }
    }, {
      key: "pointInside",
      value: function pointInside(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      }
    }, {
      key: "elementFromPoint",
      value: function elementFromPoint(x, y) {
        var element = document.elementFromPoint(x, y);
        if (!element) {
          return null;
        }
        element = this.closest(element, this.selector, this.element);
        if (!element) {
          return null;
        }
        return element;
      }
    }, {
      key: "canThrottle",
      value: function canThrottle(x, y, offsetX, offsetY) {
        return this.lastElementFromPointRect && this.pointInside(x + offsetX, y + offsetY, this.lastElementFromPointRect);
      }
    }, {
      key: "tryMove",
      value: function tryMove(x, y, offsetX, offsetY) {
        if (this.canThrottle(x, y, offsetX, offsetY)) {
          return;
        }
        var element = this.elementFromPoint(x, y);
        if (!element) {
          return;
        }
        var vm = this.getItemViewModel(element);
        this.lastElementFromPointRect = element.getBoundingClientRect();
        if (!this.allowMove({ item: vm.item })) {
          return;
        }
        this.moveSortingItem(vm.ctx.$index);
      }
    }, {
      key: "getPoint",
      value: function getPoint(pageX, pageY) {
        switch (this.axis) {
          case "x":
            pageY = this.drag.getCenterY();
            break;
          case "y":
            pageX = this.drag.getCenterX();
            break;
          default:
            break;
        }
        return {
          x: pageX,
          y: pageY
        };
      }
    }, {
      key: "down",
      value: function down(e, data, element) {
        if (this.allowDrag({ event: e, item: this.getItemViewModel(element).item })) {
          e.preventDefault();
          return undefined;
        }
        return false;
      }
    }, {
      key: "start",
      value: function start(e, data, element) {
        var _scroll2 = this.scroll;
        var scrollLeft = _scroll2.scrollLeft;
        var scrollTop = _scroll2.scrollTop;

        this.windowHeight = innerHeight;
        this.windowWidth = innerWidth;
        this.x = data.pointers[0].client.x;
        this.y = data.pointers[0].client.y;
        this.sortableRect = this.element.getBoundingClientRect();

        this.scrollRect = this.scroll.getBoundingClientRect();
        this.scrollWidth = this.scroll.scrollWidth;
        this.scrollHeight = this.scroll.scrollHeight;

        this.boundingRect = {
          left: Math.max(0, this.sortableRect.left),
          top: Math.max(0, this.sortableRect.top),
          bottom: Math.min(this.windowHeight, this.sortableRect.bottom),
          right: Math.min(this.windowWidth, this.sortableRect.right)
        };

        this.sortableContainsScroll = this.element.contains(this.scroll);
        if (this.sortableContainsScroll) {
          this.scrollMaxPosX = this.scrollWidth - this.scrollRect.width;
          this.scrollMaxPosY = this.scrollHeight - this.scrollRect.height;
          this.dragMinPosX = this.sortableRect.left;
          this.dragMaxPosX = this.sortableRect.left + this.scrollWidth;
          this.dragMaxPosY = this.sortableRect.top + this.scrollHeight;
          this.dragMinPosY = this.sortableRect.top;
        } else {
          this.scrollMaxPosX = this.sortableRect.right - this.windowWidth + (this.viewportScroll ? scrollLeft : 0);
          this.scrollMaxPosY = this.sortableRect.bottom - this.windowHeight + (this.viewportScroll ? scrollTop : 0);
          this.dragMinPosX = this.sortableRect.left + scrollLeft;
          this.dragMaxPosX = this.scrollMaxPosX + this.windowWidth;
          this.dragMinPosY = this.sortableRect.top + scrollTop;
          this.dragMaxPosY = this.scrollMaxPosY + this.windowHeight;
        }

        this.sortingViewModel = this.getItemViewModel(element);
        this.fromIx = this.sortingViewModel.ctx.$index;
        this.toIx = -1;

        this.drag.start(element, this.sortingViewModel.item, this.x, this.y, this.viewportScroll, scrollLeft, scrollTop, this.dragZIndex, this.axis, this.sortingClass, this.dragMinPosX, this.dragMaxPosX, this.dragMinPosY, this.dragMaxPosY);
        this.autoScroll.start(this.scrollSpeed);
        this.lastElementFromPointRect = this.drag.rect;
      }
    }, {
      key: "update",
      value: function update(e, data) {
        var p = data.pointers[0].client;
        var _scroll3 = this.scroll;
        var scrollLeft = _scroll3.scrollLeft;
        var scrollTop = _scroll3.scrollTop;

        this.x = p.x;
        this.y = p.y;
        this.drag.update(this.x, this.y, this.viewportScroll, scrollLeft, scrollTop, this.axis, this.dragMinPosX, this.dragMaxPosX, this.dragMinPosY, this.dragMaxPosY);

        var _getPoint2 = this.getPoint(p.x, p.y);

        var x = _getPoint2.x;
        var y = _getPoint2.y;

        var scrollX = this.autoScroll.active ? scrollLeft : 0;
        var scrollY = this.autoScroll.active ? scrollTop : 0;
        this.tryUpdate(x, y, scrollX, scrollY);

        var dirX = this.getScrollDirectionX(x, this.boundingRect);
        var dirY = this.getScrollDirectionY(y, this.boundingRect);
        var frameCntX = this.getScrollFrames(dirX === -1 ? 0 : this.scrollMaxPosX, scrollLeft);
        var frameCntY = this.getScrollFrames(dirY === -1 ? 0 : this.scrollMaxPosY, scrollTop);
        if (dirX === 1 && scrollLeft >= this.scrollMaxPosX || dirX === -1 && scrollLeft === 0) {
          frameCntX = 0;
        }
        if (dirY === 1 && scrollTop >= this.scrollMaxPosY || dirY === -1 && scrollTop === 0) {
          frameCntY = 0;
        }
        this.autoScroll.update(this.scroll, dirX, dirY, frameCntX, frameCntY);
      }
    }, {
      key: "end",
      value: function end() {
        if (!this.drag.item) {
          return; //cancelled
        }
        this.stop();
        if (this.fromIx !== this.toIx) {
          this.moved({ fromIx: this.fromIx, toIx: this.toIx });
        }
      }
    }, {
      key: "cancel",
      value: function cancel() {
        this.move(this.sortingViewModel.ctx.$index, this.fromIx);
        this.stop();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.drag.end();
        this.autoScroll.end();
      }
    }], null, _instanceInitializers);

    var _Sortable = Sortable;
    Sortable = (0, _aureliaDependencyInjection.transient)()(Sortable) || Sortable;
    Sortable = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _drag.Drag, _autoScroll.AutoScroll)(Sortable) || Sortable;
    Sortable = (0, _aureliaTemplating.customAttribute)("oa-sortable")(Sortable) || Sortable;
    return Sortable;
  })();

  exports.Sortable = Sortable;

  var SortableItem = (function () {
    var _instanceInitializers2 = {};

    function SortableItem() {
      _classCallCheck(this, _SortableItem);

      _defineDecoratedPropertyDescriptor(this, "item", _instanceInitializers2);
    }

    _createDecoratedClass(SortableItem, [{
      key: "bind",
      value: function bind(ctx, overrideCtx) {
        this.ctx = overrideCtx; //Need a reference to the item's $index
      }
    }, {
      key: "item",
      decorators: [_aureliaTemplating.bindable],
      initializer: function initializer() {
        return null;
      },
      enumerable: true
    }], null, _instanceInitializers2);

    var _SortableItem = SortableItem;
    SortableItem = (0, _aureliaTemplating.customAttribute)("oa-sortable-item")(SortableItem) || SortableItem;
    return SortableItem;
  })();

  exports.SortableItem = SortableItem;
});