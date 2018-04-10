System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.11.0",
    "aurelia-templating": "github:aurelia/templating@0.16.0",
    "babel": "npm:babel-core@5.8.25",
    "babel-runtime": "npm:babel-runtime@5.8.25",
    "core-js": "npm:core-js@0.9.18",
    "oribella-default-gestures": "github:oribella/default-gestures@0.2.0",
    "github:aurelia/binding@0.10.1": {
      "aurelia-metadata": "github:aurelia/metadata@0.9.0",
      "aurelia-pal": "github:aurelia/pal@0.2.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.8.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/dependency-injection@0.11.0": {
      "aurelia-logging": "github:aurelia/logging@0.8.0",
      "aurelia-metadata": "github:aurelia/metadata@0.9.0",
      "aurelia-pal": "github:aurelia/pal@0.2.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/loader@0.10.0": {
      "aurelia-metadata": "github:aurelia/metadata@0.9.0",
      "aurelia-path": "github:aurelia/path@0.10.0"
    },
    "github:aurelia/metadata@0.9.0": {
      "aurelia-pal": "github:aurelia/pal@0.2.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/task-queue@0.8.0": {
      "aurelia-pal": "github:aurelia/pal@0.2.0"
    },
    "github:aurelia/templating@0.16.0": {
      "aurelia-binding": "github:aurelia/binding@0.10.1",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.11.0",
      "aurelia-loader": "github:aurelia/loader@0.10.0",
      "aurelia-logging": "github:aurelia/logging@0.8.0",
      "aurelia-metadata": "github:aurelia/metadata@0.9.0",
      "aurelia-pal": "github:aurelia/pal@0.2.0",
      "aurelia-path": "github:aurelia/path@0.10.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.8.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:oribella/default-gestures@0.2.0": {
      "oribella-doubletap": "github:oribella/doubletap@0.2.0",
      "oribella-framework": "github:oribella/framework@0.2.0",
      "oribella-longtap": "github:oribella/longtap@0.2.0",
      "oribella-longtap-swipe": "github:oribella/longtap-swipe@0.2.0",
      "oribella-pinch": "github:oribella/pinch@0.2.0",
      "oribella-rotate": "github:oribella/rotate@0.2.0",
      "oribella-swipe": "github:oribella/swipe@0.2.0",
      "oribella-tap": "github:oribella/tap@0.2.0"
    },
    "github:oribella/doubletap@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "github:oribella/longtap-swipe@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "github:oribella/longtap@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "github:oribella/pinch@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "github:oribella/rotate@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "github:oribella/swipe@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "github:oribella/tap@0.2.0": {
      "oribella-framework": "github:oribella/framework@0.2.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.25": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
