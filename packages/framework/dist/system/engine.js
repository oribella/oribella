System.register(["./handle", "./utils"], function (_export) {
  /*eslint no-cond-assign: 0, no-underscore-dangle: 0*/
  "use strict";

  var Handle, GESTURE_STARTED, STRATEGY_FLAG, RETURN_FLAG, matchesSelector, POINTERS, ACTION_START, ACTION_UPDATE, ACTION_END, ACTION_CANCEL, Engine;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_handle) {
      Handle = _handle.Handle;
    }, function (_utils) {
      GESTURE_STARTED = _utils.GESTURE_STARTED;
      STRATEGY_FLAG = _utils.STRATEGY_FLAG;
      RETURN_FLAG = _utils.RETURN_FLAG;
      matchesSelector = _utils.matchesSelector;
    }],
    execute: function () {
      POINTERS = "__pointers__";
      ACTION_START = "start";
      ACTION_UPDATE = "update";
      ACTION_END = "end";
      ACTION_CANCEL = "cancel";

      _export("ACTION_START", ACTION_START);

      _export("ACTION_UPDATE", ACTION_UPDATE);

      _export("ACTION_END", ACTION_END);

      _export("ACTION_CANCEL", ACTION_CANCEL);

      Engine = (function () {
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

        _createClass(Engine, [{
          key: "registerGesture",
          value: function registerGesture(type, Gesture) {
            this.registry.register(type, Gesture);
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
            var _this = this;

            var handle = new Handle(element, type, subscriber);

            this.handles.push(handle);

            return function () {
              var ix = _this.handles.indexOf(handle);
              if (ix !== -1) {
                _this.handles.splice(ix, 1);
              }
            };
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
            return this.activeFlow === null || this.activeFlow === flow;
          }
        }, {
          key: "startFlow",
          value: function startFlow(flow, event, allPointers, currentPointers) {
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
          }
        }, {
          key: "updateFlow",
          value: function updateFlow(flow, event, allPointers, currentPointers) {
            this.processEvent(flow, event, allPointers, currentPointers, ACTION_UPDATE);
          }
        }, {
          key: "cancelFlow",
          value: function cancelFlow(flow, event, allPointers, currentPointers) {
            this.processEvent(flow, event, allPointers, currentPointers, ACTION_CANCEL);
          }
        }, {
          key: "endFlow",
          value: function endFlow(flow, event, allPointers, currentPointers) {
            this.processEvent(flow, event, allPointers, currentPointers, ACTION_END);
          }
        }, {
          key: "stopFlow",
          value: function stopFlow() {
            var gestures = this.gestures.slice(),
                gesture = undefined,
                result = undefined;

            while (gesture = gestures.shift()) {
              result = gesture.unbind();
              if (result === false) {
                this.composedGestures.push(gesture);
              }
            }

            this.gestures.length = 0;
            this.activeFlow = null;
          }
        }, {
          key: "removeGesture",
          value: function removeGesture(gesture) {
            if (gesture[GESTURE_STARTED]) {
              gesture[ACTION_CANCEL]();
            }
            gesture.unbind();
            var gestures = undefined;

            for (var _len = arguments.length, arr = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              arr[_key - 1] = arguments[_key];
            }

            while (gestures = arr.shift()) {
              var ix = gestures.indexOf(gesture);
              if (ix !== -1) {
                gestures.splice(ix, 1);
              }
            }
          }
        }, {
          key: "processEvent",
          value: function processEvent(flow, event, allPointers, currentPointers, action) {
            if (this.activeFlow !== flow) {
              return;
            }
            this.processGestures(event, allPointers, currentPointers, action);
          }
        }, {
          key: "getPointersDelta",
          value: function getPointersDelta(event, pointerCount, options) {
            if (this.isMouse(event) && !this.isValidMouseButton(event, options.which)) {
              return -1;
            }
            return pointerCount - options.touches;
          }
        }, {
          key: "processGestures",
          value: function processGestures(event, allPointers, currentPointers, action) {
            var gestures = this.gestures.slice(),
                gesture = undefined,
                result = undefined,
                allResult = undefined,
                allPointerCnt = Object.keys(allPointers).length,
                currentPointerIds = Object.keys(currentPointers),
                currentPointerCnt = currentPointerIds.length,
                pointerIx = undefined,
                pointerId = undefined,
                pointerIds = undefined,
                pointerCnt = undefined,
                pointers = undefined,
                hasPointer = undefined,
                removePointers = undefined,
                removeGesture = undefined,
                pagePoints = [],
                options = undefined;

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
              }
              if (!hasPointer) {
                continue;
              }
              //Map pointers -> pagePoints
              pointerIx = 0;
              pointerIds = Object.keys(pointers);
              pointerCnt = pointerIds.length;
              while (pointerIx < pointerCnt) {
                pagePoints.push(pointers[pointerIds[pointerIx]]);
                ++pointerIx;
              }
              this.processGesture(event, pagePoints, action, gesture, gestures);

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
          }
        }, {
          key: "processGesture",
          value: function processGesture(event, pagePoints, action, gesture, gestures) {
            //Call
            var result = gesture[action](event, pagePoints);
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
              var otherGesture = undefined;
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
          }
        }, {
          key: "createGesture",
          value: function createGesture(handle, element) {
            var gesture = this.registry.create(handle.type, handle.subscriber, element);
            gesture.bind(this.addHandle.bind(this), handle.element, this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures), function () {
              gesture[GESTURE_STARTED] = true;
            });
            return gesture;
          }
        }, {
          key: "match",
          value: function match(startElement) {
            var i = undefined,
                handle = undefined,
                element = undefined,
                selector = undefined,
                gesture = undefined,
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
          }
        }]);

        return Engine;
      })();

      _export("Engine", Engine);
    }
  };
});