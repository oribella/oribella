System.register([], function (_export) {
  "use strict";

  _export("configure", configure);

  function configure(aurelia) {
    aurelia.globalizeResources("./gestures");
  }

  return {
    setters: [],
    execute: function () {}
  };
});