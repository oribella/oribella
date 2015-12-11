"use strict";

System.register([], function (_export) {
  return {
    setters: [],
    execute: function () {
      class Handle {
        constructor(element, type, subscriber, active) {
          this.element = element;
          this.type = type;
          this.subscriber = subscriber;
          this.active = active;
        }

      }

      _export("Handle", Handle);
    }
  };
});