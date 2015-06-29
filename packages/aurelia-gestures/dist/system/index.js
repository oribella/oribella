System.register([], function (_export) {
  "use strict";

  _export("install", install);

  function install(aurelia) {
    aurelia.globalizeResources("./gestures");
  }

  return {
    setters: [],
    execute: function () {}
  };
});