System.register(["./handler", "./validator", "./flows/mouse", "./utils"], function (_export) {
  /*eslint no-cond-assign: 0, no-underscore-dangle: 0*/
  "use strict";

  var Handler, Validator, MouseFlow, GESTURE_STARTED, RETURN_FLAG, matchesSelector, ACTION_START, ACTION_UPDATE, ACTION_END, ACTION_CANCEL, Engine;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_handler) {
      Handler = _handler.Handler;
    }, function (_validator) {
      Validator = _validator.Validator;
    }, function (_flowsMouse) {
      MouseFlow = _flowsMouse.MouseFlow;
    }, function (_utils) {
      GESTURE_STARTED = _utils.GESTURE_STARTED;
      RETURN_FLAG = _utils.RETURN_FLAG;
      matchesSelector = _utils.matchesSelector;
    }],
    execute: function () {
      ACTION_START = "start";
      ACTION_UPDATE = "update";
      ACTION_END = "end";
      ACTION_CANCEL = "cancel";

      Engine = (function () {
        function Engine(element, gestureRegistry, validator) {
          _classCallCheck(this, Engine);

          this.element = element;
          this.gestureRegistry = gestureRegistry;
          this.validator = validator || new Validator();
          this.flows = [];
          this.activeFlow = undefined;
          this.handlers = [];
          this.gestures = [];
          this.composedGestures = [];
        }

        _createClass(Engine, [{
          key: "registerGesture",
          value: function registerGesture(type, Gesture) {
            this.gestureRegistry.register(type, Gesture);
          }
        }, {
          key: "getGestures",
          value: function getGestures(element) {
            var engine = this;

            if (!(element instanceof Element)) {
              throw new Error("Invalid parameter");
            }

            var exposeGesture = function exposeGesture(e, t, s) {
              return engine.addHandler(e, t, s);
            };

            var gestures = {},
                types = Object.keys(engine.gestureRegistry.gestures);

            types.forEach(function (type) {
              gestures[type] = exposeGesture.bind(null, element, type);
            });

            return gestures;
          }
        }, {
          key: "activate",
          value: function activate() {
            var stopListeners = [];
            this.flows.forEach(function (flow) {
              stopListeners.push(flow.activate());
            });
            return function () {
              stopListeners.forEach(function (stop) {
                return stop();
              });
            };
          }
        }, {
          key: "addHandler",
          value: function addHandler(element, type, subscriber) {
            var handler = Handler.create(element, type, subscriber),
                handlers = this.handlers;

            handlers.push(handler);

            function removeHandler() {
              var ix = handlers.indexOf(handler);
              if (ix !== -1) {
                //TODO: Remove gestures and tear down
                handlers.splice(ix, 1);
              }
            }

            return removeHandler;
          }
        }, {
          key: "addFlow",
          value: function addFlow(flow) {
            this.flows.push(flow);
            flow.onStart(this.startFlow.bind(this)).onUpdate(this.updateFlow.bind(this)).onCancel(this.cancelFlow.bind(this)).onEnd(this.endFlow.bind(this)).onStop(this.stopFlow.bind(this));
            return flow;
          }
        }, {
          key: "canActivateFlow",
          value: function canActivateFlow(flow) {
            if (this.activeFlow instanceof MouseFlow && flow instanceof MouseFlow) {
              return true; //Solves the scrollbar mousedown issue for IE
            }
            return this.activeFlow === undefined || this.activeFlow === flow;
          }
        }, {
          key: "startFlow",
          value: function startFlow(flow, e, data) {
            if (!this.canActivateFlow(flow)) {
              return false;
            }

            //Try match
            if (!this.activeFlow) {
              //Only match for first start
              this.gestures = this.match(e.target);
              if (!this.gestures.length) {
                return false; //No match don't continue
              }
              this.activeFlow = flow;
            }

            this.triggerGestures(flow, e, data, ACTION_START);
            return true;
          }
        }, {
          key: "updateFlow",
          value: function updateFlow(flow, e, data) {
            this.triggerGestures(flow, e, data, ACTION_UPDATE);
          }
        }, {
          key: "cancelFlow",
          value: function cancelFlow(flow, e, data) {
            this.triggerGestures(flow, e, data, ACTION_CANCEL);
          }
        }, {
          key: "endFlow",
          value: function endFlow(flow, e, data) {
            this.triggerGestures(flow, e, data, ACTION_END);
          }
        }, {
          key: "stopFlow",
          value: function stopFlow() {
            var gestures = this.gestures.slice(),
                gesture,
                result,
                handlers = this.handlers.slice(),
                handler;

            while (gesture = gestures.shift()) {
              result = gesture.unbind();
              if (result === false) {
                this.composedGestures.push(gesture);
              }
            }

            while (handler = handlers.shift()) {
              handler.active = false;
            }
            this.gestures.length = 0;
            this.activeFlow = undefined;
          }
        }, {
          key: "removeIn",
          value: function removeIn() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var g = args.shift(),
                arr;

            g.unbind();

            while (arr = args.shift()) {
              var ix = arr.indexOf(g);
              if (ix !== -1) {
                arr.splice(ix, 1);
              }
            }
          }
        }, {
          key: "removeGesture",
          value: function removeGesture(gesture) {
            this.removeIn(gesture, this.gestures, this.composedGestures);
          }
        }, {
          key: "triggerGestures",
          value: function triggerGestures(flow, e, data, action) {
            if (this.activeFlow !== flow) {
              return;
            }
            var gestures = this.gestures.slice(),
                gesture,
                result,
                valid,
                otherGestures,
                otherGesture;

            while (gesture = gestures.shift()) {
              //Validate
              valid = true;
              switch (action) {
                case ACTION_START:
                  valid = this.validator[ACTION_START](e, data, gesture.subscriber.options);
                  break;
                case ACTION_UPDATE:
                  valid = this.validator[ACTION_UPDATE](e, data, gesture.subscriber.options);
                  break;
                case ACTION_END:
                  valid = this.validator[ACTION_END](e, data, gesture.subscriber.options);
                  valid = valid && gesture[GESTURE_STARTED];
                  break;
              }
              if (valid === false) {
                //Remove
                if (gesture[GESTURE_STARTED]) {
                  gesture[ACTION_CANCEL]();
                }
                this.removeIn(gesture, gestures, this.gestures);
              }
              if (!valid) {
                continue;
              }
              //Call
              result = gesture[action](e, data);
              if (result & RETURN_FLAG.STARTED) {
                gesture[GESTURE_STARTED] = true;
              }
              if (result & RETURN_FLAG.REMOVE) {
                if (gesture[GESTURE_STARTED]) {
                  gesture[ACTION_CANCEL]();
                }
                this.removeIn(gesture, gestures, this.gestures);
              }
              if (result & RETURN_FLAG.REMOVE_OTHER_TYPES) {
                otherGestures = this.gestures.slice();
                while (otherGesture = otherGestures.shift()) {
                  if (otherGesture.__type !== gesture.__type) {
                    if (otherGesture[GESTURE_STARTED]) {
                      otherGesture[ACTION_CANCEL]();
                    }
                    this.removeIn(otherGesture, gestures, this.gestures);
                  }
                }
              }
              if (result & RETURN_FLAG.REMOVE_OTHERS) {
                otherGestures = this.gestures.slice();
                while (otherGesture = otherGestures.shift()) {
                  if (gesture === otherGesture) {
                    continue;
                  }
                  if (otherGesture[GESTURE_STARTED]) {
                    otherGesture[ACTION_CANCEL]();
                  }
                  this.removeIn(otherGesture, gestures, this.gestures);
                }
              }
            }
          }
        }, {
          key: "createGesture",
          value: function createGesture(handler, element) {
            var gesture = this.gestureRegistry.get(handler.type, handler.subscriber, element);
            gesture.bind(this.getGestures.bind(this), handler.element, this.removeGesture.bind(this, gesture));
            return gesture;
          }
        }, {
          key: "match",
          value: function match(startElement) {
            var i,
                handler,
                element,
                selector,
                gesture,
                gestures = [];

            for (element = startElement; element !== this.element; element = element.parentNode) {
              for (i = 0; i < this.handlers.length; ++i) {
                //Always evaluate length since gestures could bind gestures
                handler = this.handlers[i];
                if (handler.active) {
                  continue;
                }
                if (!handler.element.contains(element)) {
                  continue;
                }
                selector = handler.subscriber.selector;
                if (!selector && element === handler.element) {
                  handler.active = true;
                } else if (selector) {
                  if (matchesSelector(element, selector)) {
                    handler.active = true;
                  }
                }
                if (handler.active) {
                  while (gesture = this.composedGestures.shift()) {
                    if (gesture.subscriber === handler.subscriber) {
                      break;
                    }
                  }
                  if (!gesture) {
                    gesture = this.createGesture(handler, element);
                  }
                  gestures.push(gesture);
                }
              }
            }

            return gestures.sort(function (g1, g2) {
              return g1.subscriber.options.prio - g2.subscriber.options.prio;
            });
          }
        }]);

        return Engine;
      })();

      _export("Engine", Engine);
    }
  };
});