"use strict";

System.register(["./handle", "./utils"], function (_export, _context) {
  var Handle, GESTURE_STARTED, STRATEGY_FLAG, RETURN_FLAG, matchesSelector, POINTERS, ACTION_START, ACTION_UPDATE, ACTION_END, ACTION_CANCEL, Engine;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_handle) {
      /*eslint no-cond-assign: 0*/
      Handle = _handle.Handle;
    }, function (_utils) {
      GESTURE_STARTED = _utils.GESTURE_STARTED;
      STRATEGY_FLAG = _utils.STRATEGY_FLAG;
      RETURN_FLAG = _utils.RETURN_FLAG;
      matchesSelector = _utils.matchesSelector;
    }],
    execute: function () {
      POINTERS = "__pointers__";

      _export("ACTION_START", ACTION_START = "start");

      _export("ACTION_UPDATE", ACTION_UPDATE = "update");

      _export("ACTION_END", ACTION_END = "end");

      _export("ACTION_CANCEL", ACTION_CANCEL = "cancel");

      _export("ACTION_START", ACTION_START);

      _export("ACTION_UPDATE", ACTION_UPDATE);

      _export("ACTION_END", ACTION_END);

      _export("ACTION_CANCEL", ACTION_CANCEL);

      _export("Engine", Engine = function () {
        function Engine(element, registry, isMouse, isValidMouseButton) {
          _classCallCheck(this, Engine);

          this.element = element;
          this.registry = registry;
          this.isMouse = isMouse;
          this.isValidMouseButton = isValidMouseButton;
          this.flows = [];
          this.activeFlow = null;
          this.handles = [];
          this.gestures = [];
          this.composedGestures = [];
        }

        Engine.prototype.registerGesture = function registerGesture(type, Gesture) {
          this.registry.register(type, Gesture);
        };

        Engine.prototype.activate = function activate() {
          var stopListeners = [];
          this.flows.forEach(function (flow) {
            stopListeners.push(flow.activate());
          });
          return function () {
            stopListeners.forEach(function (stop) {
              return stop();
            });
          };
        };

        Engine.prototype.addHandle = function addHandle(element, type, subscriber) {
          var _this = this;

          var handle = new Handle(element, type, subscriber);

          this.handles.push(handle);

          return function () {
            var ix = _this.handles.indexOf(handle);
            if (ix !== -1) {
              _this.handles.splice(ix, 1);
            }
          };
        };

        Engine.prototype.addFlow = function addFlow(flow) {
          this.flows.push(flow);
          flow.onStart(this.startFlow.bind(this)).onUpdate(this.updateFlow.bind(this)).onCancel(this.cancelFlow.bind(this)).onEnd(this.endFlow.bind(this)).onStop(this.stopFlow.bind(this));
          return flow;
        };

        Engine.prototype.canActivateFlow = function canActivateFlow(flow) {
          return this.activeFlow === null || this.activeFlow === flow;
        };

        Engine.prototype.startFlow = function startFlow(flow, event, allPointers, currentPointers) {
          if (!this.canActivateFlow(flow)) {
            return false;
          }

          this.activeFlow = flow;

          this.gestures = this.gestures.concat(this.match(event.target)).sort(function (g1, g2) {
            return g1.subscriber.options.prio - g2.subscriber.options.prio;
          });

          if (!this.gestures.length) {
            return false; //No match don't continue
          }

          this.processEvent(flow, event, allPointers, currentPointers, ACTION_START);

          return true;
        };

        Engine.prototype.updateFlow = function updateFlow(flow, event, allPointers, currentPointers) {
          this.processEvent(flow, event, allPointers, currentPointers, ACTION_UPDATE);
        };

        Engine.prototype.cancelFlow = function cancelFlow(flow, event, allPointers, currentPointers) {
          this.processEvent(flow, event, allPointers, currentPointers, ACTION_CANCEL);
        };

        Engine.prototype.endFlow = function endFlow(flow, event, allPointers, currentPointers) {
          this.processEvent(flow, event, allPointers, currentPointers, ACTION_END);
        };

        Engine.prototype.stopFlow = function stopFlow() {
          var gestures = this.gestures.slice(),
              gesture = void 0,
              result = void 0;

          while (gesture = gestures.shift()) {
            result = gesture.unbind();
            if (result === false) {
              this.composedGestures.push(gesture);
            }
          }

          this.gestures.length = 0;
          this.activeFlow = null;
        };

        Engine.prototype.removeGesture = function removeGesture(gesture) {
          if (gesture[GESTURE_STARTED]) {
            gesture[ACTION_CANCEL]();
          }
          gesture.unbind();
          var gestures = void 0;

          for (var _len = arguments.length, arr = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            arr[_key - 1] = arguments[_key];
          }

          while (gestures = arr.shift()) {
            var ix = gestures.indexOf(gesture);
            if (ix !== -1) {
              gestures.splice(ix, 1);
            }
          }
        };

        Engine.prototype.processEvent = function processEvent(flow, event, allPointers, currentPointers, action) {
          if (this.activeFlow !== flow) {
            return;
          }
          this.processGestures(event, allPointers, currentPointers, action);
        };

        Engine.prototype.getPointersDelta = function getPointersDelta(event, pointerCount, options) {
          if (this.isMouse(event) && !this.isValidMouseButton(event, options.which)) {
            return -1;
          }
          return pointerCount - options.touches;
        };

        Engine.prototype.processGestures = function processGestures(event, allPointers, currentPointers, action) {
          var gestures = this.gestures.slice(),
              gesture = void 0,
              result = void 0,
              allResult = void 0,
              allPointerCnt = Object.keys(allPointers).length,
              currentPointerIds = Object.keys(currentPointers),
              currentPointerCnt = currentPointerIds.length,
              pointerIx = void 0,
              pointerId = void 0,
              pointerIds = void 0,
              pointerCnt = void 0,
              pointers = void 0,
              hasPointer = void 0,
              removePointers = void 0,
              removeGesture = void 0,
              options = void 0;

          while (gesture = gestures.shift()) {
            hasPointer = false;
            removePointers = false;
            removeGesture = false;
            pointers = gesture[POINTERS];
            options = gesture.subscriber.options;

            allResult = this.getPointersDelta(event, allPointerCnt, options);
            if (allResult > 0 && options.strategy & STRATEGY_FLAG.REMOVE_IF_POINTERS_GT) {
              this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
              continue;
            }

            result = this.getPointersDelta(event, currentPointerCnt, options);
            switch (action) {
              case ACTION_START:
                if (result !== 0) {
                  if (allResult === 0) {
                    currentPointers = allPointers;
                  } else {
                    continue;
                  }
                }
                if (pointers && Object.keys(pointers).length === currentPointerCnt) {
                  continue;
                }
                //Lock pointers for gesture
                gesture[POINTERS] = pointers = currentPointers;
                hasPointer = true;
                break;
              case ACTION_UPDATE:
                //Update pointers for gesture
                pointerIx = 0;
                while (pointerIx < currentPointerCnt) {
                  pointerId = currentPointerIds[pointerIx];
                  if (pointers && pointers[pointerId]) {
                    pointers[pointerId] = currentPointers[pointerId];
                    hasPointer = true;
                  }
                  ++pointerIx;
                }
                break;
              case ACTION_END:
                if (!gesture[GESTURE_STARTED]) {
                  continue;
                }
                pointerIx = 0;
                while (pointerIx < currentPointerCnt) {
                  pointerId = currentPointerIds[pointerIx];
                  if (pointers && pointers[pointerId]) {
                    hasPointer = true;
                    removePointers = true;
                  }
                  ++pointerIx;
                }
                if (pointers && !Object.keys(pointers).length) {
                  hasPointer = true;
                  removeGesture = true;
                }
                break;
              case ACTION_CANCEL:
                pointers = currentPointers;
                hasPointer = true;
                break;
            }
            if (!hasPointer) {
              continue;
            }
            //Map pointers to separate object reference
            var mappedPointers = [];
            pointerIx = 0;
            pointerIds = Object.keys(pointers);
            pointerCnt = pointerIds.length;
            while (pointerIx < pointerCnt) {
              mappedPointers.push(pointers[pointerIds[pointerIx]]);
              ++pointerIx;
            }
            this.processGesture(event, mappedPointers, action, gesture, gestures);

            if (removePointers) {
              pointerIx = 0;
              while (pointerIx < currentPointerCnt) {
                pointerId = currentPointerIds[pointerIx];
                if (pointers[pointerId]) {
                  delete pointers[pointerId];
                }
                ++pointerIx;
              }
            }

            if (removeGesture) {
              gesture[POINTERS] = null;
              gesture[GESTURE_STARTED] = false;
              this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
            }
          }
        };

        Engine.prototype.processGesture = function processGesture(event, pointers, action, gesture, gestures) {
          //Call
          var result = gesture[action](event, pointers);
          if (result & RETURN_FLAG.STARTED) {
            gesture[GESTURE_STARTED] = true;
          }

          //Remove gesture
          if (result & RETURN_FLAG.REMOVE) {
            this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
          }

          //Remove all other gestures
          if (result & RETURN_FLAG.REMOVE_OTHERS) {
            var otherGestures = gestures.slice();
            var otherGesture = void 0;
            while (otherGesture = otherGestures.shift()) {
              if (gesture === otherGesture) {
                continue;
              }
              if (otherGesture[GESTURE_STARTED]) {
                otherGesture[ACTION_CANCEL]();
              }
              this.removeGesture(otherGesture, this.gestures, this.composedGestures, gestures);
            }
          }
        };

        Engine.prototype.createGesture = function createGesture(handle, element) {
          var gesture = this.registry.create(handle.type, handle.subscriber, element);
          gesture.bind(this.addHandle.bind(this), handle.element, this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures), function () {
            gesture[GESTURE_STARTED] = true;
          });
          return gesture;
        };

        Engine.prototype.match = function match(startElement) {
          var i = void 0,
              handle = void 0,
              element = void 0,
              selector = void 0,
              gesture = void 0,
              gestures = [],
              matched = false;

          for (element = startElement; element !== this.element; element = element.parentNode) {
            for (i = 0; i < this.handles.length; ++i) {
              //Always evaluate length since gestures could bind gestures
              handle = this.handles[i];
              selector = handle.subscriber.selector;

              if (!handle.element.contains(element) || selector && handle.element === element) {
                continue;
              }

              if (!selector && element === handle.element) {
                matched = true;
              } else if (selector) {
                if (matchesSelector(element, selector)) {
                  matched = true;
                }
              }
              if (matched) {
                while (gesture = this.composedGestures.shift()) {
                  if (gesture.subscriber === handle.subscriber) {
                    break;
                  }
                }
                if (!gesture) {
                  gesture = this.createGesture(handle, element);
                }
                gestures.push(gesture);
              }
            }
          }

          return gestures;
        };

        return Engine;
      }());

      _export("Engine", Engine);
    }
  };
});
"use strict";

System.register([], function (_export, _context) {
  var Flow;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  /*eslint no-cond-assign: 0*/

  function removeListener(element, event, fn) {
    element.removeEventListener(event, fn, false);
  }

  function addListener(element, event, fn) {
    element.addEventListener(event, fn, false);
    return removeListener.bind(null, element, event, fn);
  }

  return {
    setters: [],
    execute: function () {
      _export("Flow", Flow = function () {
        function Flow(element, Point, events, stopEmulatedMouseEvents) {
          _classCallCheck(this, Flow);

          this.element = element;
          this.Point = Point;
          this.events = events;
          this.stopEmulatedMouseEvents = stopEmulatedMouseEvents;
          this.addListeners = [];
          this.removeListeners = [];
          this.allPointers = {};
          this.currentPointers = {};
          this.init();
        }

        Flow.prototype.init = function init() {
          var event, key, types, type, fn;

          while (event = this.events.shift()) {
            key = Object.keys(event).shift();
            types = event[key];
            fn = this[key].bind(this);

            if (key === "start") {
              this.startListener = addListener.bind(null, this.element, types.shift(), fn);
            } else {
              while (type = types.shift()) {
                this.addListeners.push(addListener.bind(null, this.element, type, fn));
              }
            }
          }
        };

        Flow.prototype.normalizePoints = function normalizePoints() /*event, data, Point*/{
          throw new Error("normalizePoints: must be implemented in sub class");
        };

        Flow.prototype.onStart = function onStart(startCallback) {
          this.startCallback = startCallback;
          return this;
        };

        Flow.prototype.onUpdate = function onUpdate(updateCallback) {
          this.updateCallback = updateCallback;
          return this;
        };

        Flow.prototype.onCancel = function onCancel(cancelCallback) {
          this.cancelCallback = cancelCallback;
          return this;
        };

        Flow.prototype.onEnd = function onEnd(endCallback) {
          this.endCallback = endCallback;
          return this;
        };

        Flow.prototype.onStop = function onStop(stopCallback) {
          this.stopCallback = stopCallback;
        };

        Flow.prototype.activate = function activate() {
          return this.startListener();
        };

        Flow.prototype.start = function start(event) {
          this.normalizePoints(event, this.Point);
          if (this.startCallback(this, event, this.allPointers, this.currentPointers)) {
            this.continue();
          }
        };

        Flow.prototype.continue = function _continue() {
          var i,
              cnt = this.addListeners.length;

          for (i = 0; i < cnt; ++i) {
            this.removeListeners.push(this.addListeners[i]());
          }
        };

        Flow.prototype.update = function update(event) {
          this.normalizePoints(event, this.Point);
          this.updateCallback(this, event, this.allPointers, this.currentPointers);
        };

        Flow.prototype.end = function end(event) {
          this.normalizePoints(event, this.Point);
          this.endCallback(this, event, this.allPointers, this.currentPointers);
          if (Object.keys(this.allPointers).length === 0) {
            this.stop();
          }
        };

        Flow.prototype.cancel = function cancel(event) {
          this.cancelCallback(this, event, this.allPointers, this.currentPointers);
          this.stop();
        };

        Flow.prototype.stop = function stop() {
          var i,
              cnt = this.removeListeners.length;

          for (i = 0; i < cnt; ++i) {
            this.removeListeners[i]();
          }
          this.removeListeners.length = 0;
          this.stopCallback(this);
        };

        return Flow;
      }());

      _export("Flow", Flow);
    }
  };
});
"use strict";

System.register(["./flow"], function (_export, _context) {
  var Flow, MouseFlow;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      _export("MouseFlow", MouseFlow = function (_Flow) {
        _inherits(MouseFlow, _Flow);

        function MouseFlow(element, Point) {
          _classCallCheck(this, MouseFlow);

          return _possibleConstructorReturn(this, _Flow.call(this, element, Point, [{
            start: ["mousedown"]
          }, {
            update: ["mousemove"]
          }, {
            end: ["mouseup"]
          }, {
            cancel: ["dragstart", "contextmenu"]
          }], false));
        }

        MouseFlow.prototype.normalizePoints = function normalizePoints(event, Point) {
          switch (event.type) {
            case "mousedown":
            case "mousemove":
              this.allPointers = this.currentPointers = {
                1: {
                  page: new Point(event.pageX, event.pageY),
                  client: new Point(event.clientX, event.clientY)
                }
              };
              break;
            default:
              this.allPointers = {};
              break;
          }
        };

        return MouseFlow;
      }(Flow));

      _export("MouseFlow", MouseFlow);
    }
  };
});
"use strict";

System.register(["./pointer"], function (_export, _context) {
  var PointerFlow, MSPointerFlow;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_pointer) {
      PointerFlow = _pointer.PointerFlow;
    }],
    execute: function () {
      _export("MSPointerFlow", MSPointerFlow = function (_PointerFlow) {
        _inherits(MSPointerFlow, _PointerFlow);

        function MSPointerFlow(element, Point) {
          _classCallCheck(this, MSPointerFlow);

          return _possibleConstructorReturn(this, _PointerFlow.call(this, element, Point, [{
            start: ["MSPointerDown"]
          }, {
            update: ["MSPointerMove"]
          }, {
            end: ["MSPointerUp"]
          }, {
            cancel: ["MSPointerCancel", "dragstart"]
          }]));
        }

        return MSPointerFlow;
      }(PointerFlow));

      _export("MSPointerFlow", MSPointerFlow);
    }
  };
});
"use strict";

System.register(["./flow"], function (_export, _context) {
  var Flow, PointerFlow;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      _export("PointerFlow", PointerFlow = function (_Flow) {
        _inherits(PointerFlow, _Flow);

        function PointerFlow(element, Point) {
          _classCallCheck(this, PointerFlow);

          return _possibleConstructorReturn(this, _Flow.call(this, element, Point, [{
            start: ["pointerdown"]
          }, {
            update: ["pointermove"]
          }, {
            end: ["pointerup"]
          }, {
            cancel: ["pointercancel", "dragstart"]
          }]));
        }

        PointerFlow.prototype.normalizePoints = function normalizePoints(event, Point) {
          this.currentPointers = {};
          this.currentPointers[event.pointerId] = {
            page: new Point(event.pageX, event.pageY),
            client: new Point(event.clientX, event.clientY)
          };

          switch (event.type) {
            case "pointerdown":
            case "pointermove":
              this.allPointers[event.pointerId] = {
                page: new Point(event.pageX, event.pageY),
                client: new Point(event.clientX, event.clientY)
              };
              break;
            default:
              delete this.allPointers[event.pointerId];
              break;
          }
        };

        return PointerFlow;
      }(Flow));

      _export("PointerFlow", PointerFlow);
    }
  };
});
"use strict";

System.register(["./flow"], function (_export, _context) {
  var Flow, TouchFlow;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_flow) {
      Flow = _flow.Flow;
    }],
    execute: function () {
      _export("TouchFlow", TouchFlow = function (_Flow) {
        _inherits(TouchFlow, _Flow);

        function TouchFlow(element, Point) {
          _classCallCheck(this, TouchFlow);

          return _possibleConstructorReturn(this, _Flow.call(this, element, Point, [{
            start: ["touchstart"]
          }, {
            update: ["touchmove"]
          }, {
            end: ["touchend", "mouseup", "click"]
          }, {
            cancel: ["touchcancel", "dragstart"]
          }], true));
        }

        TouchFlow.prototype.normalizePoints = function normalizePoints(event, Point) {
          var _this2 = this;

          this.allPointers = {};
          this.currentPointers = {};

          Array.prototype.slice.call(event.touches).forEach(function (pointer) {
            _this2.allPointers[pointer.identifier] = {
              page: new Point(pointer.pageX, pointer.pageY),
              client: new Point(pointer.clientX, pointer.clientY)
            };
          });

          Array.prototype.slice.call(event.changedTouches).forEach(function (pointer) {
            _this2.currentPointers[pointer.identifier] = {
              page: new Point(pointer.pageX, pointer.pageY),
              client: new Point(pointer.clientX, pointer.clientY)
            };
          });
        };

        return TouchFlow;
      }(Flow));

      _export("TouchFlow", TouchFlow);
    }
  };
});
"use strict";

System.register([], function (_export, _context) {
  var Handle;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("Handle", Handle = function Handle(element, type, subscriber, active) {
        _classCallCheck(this, Handle);

        this.element = element;
        this.type = type;
        this.subscriber = subscriber;
        this.active = active;
      });

      _export("Handle", Handle);
    }
  };
});
"use strict";

System.register(["./point", "./utils", "./oribella"], function (_export, _context) {
  return {
    setters: [function (_point) {
      var _exportObj = {};
      _exportObj.Point = _point.Point;

      _export(_exportObj);
    }, function (_utils) {
      var _exportObj2 = {};
      _exportObj2.GESTURE_STARTED = _utils.GESTURE_STARTED;
      _exportObj2.STRATEGY_FLAG = _utils.STRATEGY_FLAG;
      _exportObj2.RETURN_FLAG = _utils.RETURN_FLAG;
      _exportObj2.matchesSelector = _utils.matchesSelector;

      _export(_exportObj2);
    }, function (_oribella) {
      var _exportObj3 = {};
      _exportObj3.Oribella = _oribella.Oribella;

      _export(_exportObj3);
    }],
    execute: function () {}
  };
});
"use strict";

System.register(["./engine", "./registry", "./flows/mouse", "./flows/touch", "./flows/ms-pointer", "./flows/pointer", "./point"], function (_export, _context) {
  var Engine, Registry, MouseFlow, TouchFlow, MSPointerFlow, PointerFlow, Point, Oribella;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_engine) {
      Engine = _engine.Engine;
    }, function (_registry) {
      Registry = _registry.Registry;
    }, function (_flowsMouse) {
      MouseFlow = _flowsMouse.MouseFlow;
    }, function (_flowsTouch) {
      TouchFlow = _flowsTouch.TouchFlow;
    }, function (_flowsMsPointer) {
      MSPointerFlow = _flowsMsPointer.MSPointerFlow;
    }, function (_flowsPointer) {
      PointerFlow = _flowsPointer.PointerFlow;
    }, function (_point) {
      Point = _point.Point;
    }],
    execute: function () {
      _export("Oribella", Oribella = function () {
        function Oribella(element, config) {
          _classCallCheck(this, Oribella);

          this.element = element;
          this.config = config;
          this.registry = new Registry();
          this.engine = new Engine(this.element, this.registry, this.isMouse.bind(this), this.isValidMouseButton.bind(this));
        }

        Oribella.prototype.activate = function activate() {
          return this.engine.activate();
        };

        Oribella.prototype.withDefaultFlowStrategy = function withDefaultFlowStrategy() {
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
        };

        Oribella.prototype.registerGesture = function registerGesture(type, Gesture) {
          this.engine.registerGesture(type, Gesture);
          return this;
        };

        Oribella.prototype.on = function on(element, type, subscriber) {
          return this.engine.addHandle(element, type, subscriber);
        };

        Oribella.prototype.isMouse = function isMouse(e) {
          if (this.config.msPointerEnabled && e.pointerType === e.MSPOINTER_TYPE_MOUSE) {
            //IE10
            return true;
          }
          if (this.config.pointerEnabled && e.pointerType === "mouse") {
            //IE11
            return true;
          }
          if (e.type.indexOf("mouse") !== -1) {
            return true;
          }
          return false;
        };

        Oribella.prototype.isValidMouseButton = function isValidMouseButton(event, allowedBtn) {
          var btn = event.button,
              which = event.which,
              actualBtn;

          actualBtn = !which && btn !== undefined ? btn & 1 ? 1 : btn & 2 ? 3 : btn & 4 ? 2 : 0 : which;
          return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
            return actualBtn === val;
          }) : actualBtn === allowedBtn;
        };

        return Oribella;
      }());

      _export("Oribella", Oribella);
    }
  };
});
"use strict";

System.register([], function (_export, _context) {
  var Point;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("Point", Point = function () {
        function Point(x, y) {
          _classCallCheck(this, Point);

          this.x = x;
          this.y = y;
        }

        Point.prototype.distanceTo = function distanceTo(p) {
          var xdist = this.x - p.x,
              ydist = this.y - p.y,
              dist = Math.sqrt(xdist * xdist + ydist * ydist);

          return dist;
        };

        Point.prototype.deltaAngleTo = function deltaAngleTo(p) {
          var x = p.x - this.x,
              y = p.y - this.y,
              theta = Math.atan2(y, x),
              degrees = theta * 180 / Math.PI;
          return degrees;
        };

        Point.prototype.clone = function clone() {
          return new Point(this.x, this.y);
        };

        return Point;
      }());

      _export("Point", Point);
    }
  };
});
"use strict";

System.register([], function (_export, _context) {
  var Ensure, DefaultGestureOptions, Registry;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function getOwnPropertyDescriptors(src) {
    var descriptors = {};
    Object.getOwnPropertyNames(src).forEach(function (key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(src, key);
    });
    return descriptors;
  }

  return {
    setters: [],
    execute: function () {
      _export("Ensure", Ensure = function () {
        function Ensure(fns) {
          _classCallCheck(this, Ensure);

          this.fns = fns;
        }

        Ensure.prototype.ensure = function ensure(o) {
          this.fns.forEach(function (key) {
            if (typeof o[key] !== "function") {
              o[key] = function () {};
            }
          });
        };

        return Ensure;
      }());

      _export("Ensure", Ensure);

      DefaultGestureOptions = {
        touches: 1,
        which: 1,
        prio: 100
      };

      _export("Registry", Registry = function () {
        function Registry() {
          _classCallCheck(this, Registry);

          this.gestures = {};
          this.defaultGesture = new Ensure(["start", "update", "end", "cancel", "bind", "unbind"]);
          this.defaultSubscriber = new Ensure(["down", "start", "update", "end", "cancel"]);
        }

        Registry.prototype.register = function register(type, Gesture) {
          this.defaultGesture.ensure(Gesture.prototype);
          this.gestures[type] = Gesture;
        };

        Registry.prototype.getTypes = function getTypes() {
          return Object.keys(this.gestures);
        };

        Registry.prototype.create = function create(type, subscriber, element) {
          var defaultOptions = null;
          var defaultOptionsPropertyDescriptors = {};
          this.defaultSubscriber.ensure(subscriber);
          if (typeof this.gestures[type].defaultOptions === "function") {
            defaultOptions = this.gestures[type].defaultOptions();
            defaultOptionsPropertyDescriptors = getOwnPropertyDescriptors(defaultOptions);
          }
          defaultOptions = Object.create(DefaultGestureOptions, defaultOptionsPropertyDescriptors);
          var optionsPropertyDescriptors = getOwnPropertyDescriptors(subscriber.options);
          subscriber.options = Object.create(defaultOptions, optionsPropertyDescriptors);
          var gesture = new this.gestures[type](subscriber, element);
          return gesture;
        };

        return Registry;
      }());

      _export("Registry", Registry);
    }
  };
});
"use strict";

System.register([], function (_export, _context) {
  var GESTURE_STARTED, STRATEGY_FLAG, RETURN_FLAG;
  return {
    setters: [],
    execute: function () {
      _export("GESTURE_STARTED", GESTURE_STARTED = "__started__");

      _export("GESTURE_STARTED", GESTURE_STARTED);

      _export("STRATEGY_FLAG", STRATEGY_FLAG = {
        REMOVE_IF_POINTERS_GT: 1
      });

      _export("STRATEGY_FLAG", STRATEGY_FLAG);

      _export("RETURN_FLAG", RETURN_FLAG = {
        map: function map(result) {
          switch (result) {
            case true:
              result = this.REMOVE_OTHERS;
              break;
            case false:
              result = this.REMOVE;
              break;
            case 1:
            case 2:
            case 4:
              break;
            default:
              result = 0;
          }

          return result;
        },

        STARTED: 1,
        REMOVE: 2,
        REMOVE_OTHERS: 4
      });

      _export("RETURN_FLAG", RETURN_FLAG);

      function matchesSelector(element, selector) {
        return (element.matchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector).call(element, selector);
      }

      _export("matchesSelector", matchesSelector);
    }
  };
});

//# sourceMappingURL=oribella-framework.js.map