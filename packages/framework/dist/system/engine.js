System.register(["./handle", "./validator", "./flows/mouse", "./utils"], function (_export) {
  /*eslint no-cond-assign: 0, no-underscore-dangle: 0*/
  "use strict";

  var Handle, Validator, MouseFlow, GESTURE_STARTED, RETURN_FLAG, matchesSelector, ACTION_START, ACTION_UPDATE, ACTION_END, ACTION_CANCEL, Engine;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_handle) {
      Handle = _handle.Handle;
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
          this.handles = [];
          this.gestures = [];
          this.composedGestures = [];
        }

        _createClass(Engine, [{
          key: "registerGesture",
          value: function registerGesture(type, Gesture) {
            this.gestureRegistry.register(type, Gesture);
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
          key: "addHandle",
          value: function addHandle(element, type, subscriber) {
            var handle = new Handle(element, type, subscriber),
                handles = this.handles;

            handles.push(handle);

            function removeHandle() {
              var ix = handles.indexOf(handle);
              if (ix !== -1) {
                handles.splice(ix, 1);
              }
            }

            return removeHandle;
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

            this.processEvent(flow, e, data, ACTION_START);

            return true;
          }
        }, {
          key: "updateFlow",
          value: function updateFlow(flow, e, data) {
            this.processEvent(flow, e, data, ACTION_UPDATE);
          }
        }, {
          key: "cancelFlow",
          value: function cancelFlow(flow, e, data) {
            this.processEvent(flow, e, data, ACTION_CANCEL);
          }
        }, {
          key: "endFlow",
          value: function endFlow(flow, e, data) {
            this.processEvent(flow, e, data, ACTION_END);
          }
        }, {
          key: "stopFlow",
          value: function stopFlow() {
            var gestures = this.gestures.slice(),
                gesture,
                result,
                handles = this.handles.slice(),
                handler;

            while (gesture = gestures.shift()) {
              result = gesture.unbind();
              if (result === false) {
                this.composedGestures.push(gesture);
              }
            }

            while (handler = handles.shift()) {
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
          key: "processEvent",
          value: function processEvent(flow, e, data, action) {
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

              //Remove gesture
              if (result & RETURN_FLAG.REMOVE) {
                if (gesture[GESTURE_STARTED]) {
                  gesture[ACTION_CANCEL]();
                }
                this.removeIn(gesture, gestures, this.gestures);
              }

              //Remove all other gestures
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
            var gesture = this.gestureRegistry.create(handler.type, handler.subscriber, element);
            gesture.bind(this.addHandle.bind(this), handler.element, this.removeGesture.bind(this, gesture));
            return gesture;
          }
        }, {
          key: "match",
          value: function match(startElement) {
            var i,
                handle,
                element,
                selector,
                gesture,
                gestures = [];

            for (element = startElement; element !== this.element; element = element.parentNode) {
              for (i = 0; i < this.handles.length; ++i) {
                //Always evaluate length since gestures could bind gestures
                handle = this.handles[i];
                if (handle.active) {
                  continue;
                }
                if (!handle.element.contains(element)) {
                  continue;
                }
                selector = handle.subscriber.selector;
                if (!selector && element === handle.element) {
                  handle.active = true;
                } else if (selector) {
                  if (matchesSelector(element, selector)) {
                    handle.active = true;
                  }
                }
                if (handle.active) {
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