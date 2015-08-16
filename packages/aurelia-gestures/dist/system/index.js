System.register([], function (_export) {
  "use strict";

  _export("configure", configure);

  function configure(config) {
    config.globalResources("./gestures");
  }

  return {
    setters: [],
    execute: function () {}
  };
});