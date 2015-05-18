System.register([], function (_export) {
  _export("install", install);

  function install(aurelia) {
    aurelia.globalizeResources("./gestures");
  }

  return {
    setters: [],
    execute: function () {
      "use strict";
    }
  };
});