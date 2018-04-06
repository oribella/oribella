define(["exports", "./handle", "./utils"], function (exports, _handle, _utils) {
  /*eslint no-cond-assign: 0, no-underscore-dangle: 0*/
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var POINTERS = "__pointers__";

  var ACTION_START = "start",
      ACTION_UPDATE = "update",
      ACTION_END = "end",
      ACTION_CANCEL = "cancel";

  exports.ACTION_START = ACTION_START;
  exports.ACTION_UPDATE = ACTION_UPDATE;
  exports.ACTION_END = ACTION_END;
  exports.ACTION_CANCEL = ACTION_CANCEL;

  var Engine = (function () {
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

        var handle = new _handle.Handle(element, type, subscriber);

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
        if (gesture[_utils.GESTURE_STARTED]) {
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
            allPointerCnt = Object.keys(allPointers).length,
            pointerIds = Object.keys(currentPointers),
            pointerCnt = pointerIds.length,
            pointerIx = undefined,
            pointerId = undefined,
            pointers = undefined,
            hasPointer = undefined,
            removeGesture = undefined,
            pagePoints = [],
            options = undefined;

        while (gesture = gestures.shift()) {
          hasPointer = false;
          removeGesture = false;
          pointers = gesture[POINTERS];
          options = gesture.subscriber.options;

          result = this.getPointersDelta(event, allPointerCnt, options);
          if (result > 0 && options.strategy & _utils.STRATEGY_FLAG.REMOVE_IF_POINTERS_GT) {
            this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
            continue;
          }

          result = this.getPointersDelta(event, pointerCnt, options);
          switch (action) {
            case ACTION_START:
              if (result !== 0) {
                continue;
              }
              if (pointers && Object.keys(pointers).length === pointerCnt) {
                continue;
              }
              //Lock pointers for gesture
              gesture[POINTERS] = pointers = currentPointers;
              hasPointer = true;
              break;
            case ACTION_UPDATE:
              //Update pointers for gesture
              pointerIx = 0;
              while (pointerIx < pointerCnt) {
                pointerId = pointerIds[pointerIx];
                if (pointers && pointers[pointerId]) {
                  pointers[pointerId] = currentPointers[pointerId];
                  hasPointer = true;
                }
                ++pointerIx;
              }
              break;
            case ACTION_END:
              if (!gesture[_utils.GESTURE_STARTED]) {
                continue;
              }
              //Remove pointers for gesture
              pointerIx = 0;
              while (pointerIx < pointerCnt) {
                pointerId = pointerIds[pointerIx];
                if (pointers && pointers[pointerId]) {
                  delete pointers[pointerId];
                  hasPointer = true;
                }
                ++pointerIx;
              }
              if (pointers && !Object.keys(pointers).length) {
                pointers = undefined;
                //Call end with currentPointers
                pointers = currentPointers;
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
          pointerCnt = Object.keys(pointers).length;
          while (pointerIx < pointerCnt) {
            pagePoints.push(pointers[pointerIds[pointerIx]]);
            ++pointerIx;
          }
          this.processGesture(event, pagePoints, action, gesture, gestures);

          if (removeGesture) {
            gesture[_utils.GESTURE_STARTED] = false;
            this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
          }
        }
      }
    }, {
      key: "processGesture",
      value: function processGesture(event, pagePoints, action, gesture, gestures) {
        //Call
        var result = gesture[action](event, pagePoints);
        if (result & _utils.RETURN_FLAG.STARTED) {
          gesture[_utils.GESTURE_STARTED] = true;
        }

        //Remove gesture
        if (result & _utils.RETURN_FLAG.REMOVE) {
          this.removeGesture(gesture, this.gestures, this.composedGestures, gestures);
        }

        //Remove all other gestures
        if (result & _utils.RETURN_FLAG.REMOVE_OTHERS) {
          var otherGestures = gestures.slice();
          var otherGesture = undefined;
          while (otherGesture = otherGestures.shift()) {
            if (gesture === otherGesture) {
              continue;
            }
            if (otherGesture[_utils.GESTURE_STARTED]) {
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
          gesture[_utils.GESTURE_STARTED] = true;
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

            if (!handle.element.contains(element) || handle.element === element) {
              continue;
            }
            selector = handle.subscriber.selector;
            if (!selector && element === handle.element) {
              matched = true;
            } else if (selector) {
              if ((0, _utils.matchesSelector)(element, selector)) {
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

  exports.Engine = Engine;
});