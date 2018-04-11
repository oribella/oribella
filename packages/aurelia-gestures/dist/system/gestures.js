System.register(["tslib", "aurelia-pal", "aurelia-templating", "aurelia-dependency-injection", "oribella"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var tslib_1, aurelia_pal_1, aurelia_templating_1, aurelia_dependency_injection_1, oribella_1, OaTap, OaDoubletap, OaLongtap, OaSwipe, OaLongtapSwipe, OaPinch, OaRotate;
    return {
        setters: [
            function (tslib_1_1) {
                tslib_1 = tslib_1_1;
            },
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            },
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (oribella_1_1) {
                oribella_1 = oribella_1_1;
            }
        ],
        execute: function () {
            OaTap = (function () {
                function OaTap(element) {
                    this.element = element;
                    this.options = {};
                    this.start = function () { };
                    this.end = function () { };
                    this.cancel = function () { };
                    this.stop = function () { };
                    this.remove = function () { };
                }
                OaTap.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.Tap, this.element, this);
                };
                OaTap.prototype.detached = function () {
                    this.remove();
                };
                return OaTap;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaTap.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaTap.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaTap.prototype, "start", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaTap.prototype, "end", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaTap.prototype, "cancel", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaTap.prototype, "stop", void 0);
            OaTap = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-tap'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaTap);
            exports_1("OaTap", OaTap);
            OaDoubletap = (function () {
                function OaDoubletap(element) {
                    this.element = element;
                    this.end = function () { };
                    this.remove = function () { };
                }
                OaDoubletap.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.Doubletap, this.element, this);
                };
                OaDoubletap.prototype.detached = function () {
                    this.remove();
                };
                return OaDoubletap;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaDoubletap.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaDoubletap.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaDoubletap.prototype, "end", void 0);
            OaDoubletap = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-doubletap'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaDoubletap);
            exports_1("OaDoubletap", OaDoubletap);
            OaLongtap = (function () {
                function OaLongtap(element) {
                    this.element = element;
                    this.options = {};
                    this.start = function () { };
                    this.end = function () { };
                    this.cancel = function () { };
                    this.stop = function () { };
                    this.timeEnd = function () { };
                    this.remove = function () { };
                }
                OaLongtap.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.Longtap, this.element, this);
                };
                OaLongtap.prototype.detached = function () {
                    this.remove();
                };
                return OaLongtap;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtap.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtap.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtap.prototype, "start", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtap.prototype, "end", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtap.prototype, "cancel", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtap.prototype, "stop", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaLongtap.prototype, "timeEnd", void 0);
            OaLongtap = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-longtap'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaLongtap);
            exports_1("OaLongtap", OaLongtap);
            OaSwipe = (function () {
                function OaSwipe(element) {
                    this.element = element;
                    this.options = {};
                    this.down = function () { };
                    this.start = function () { };
                    this.update = function () { };
                    this.end = function () { };
                    this.cancel = function () { };
                    this.stop = function () { };
                    this.remove = function () { };
                }
                OaSwipe.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.Swipe, this.element, this);
                };
                OaSwipe.prototype.detached = function () {
                    this.remove();
                };
                return OaSwipe;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "down", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "start", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaSwipe.prototype, "update", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "end", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "cancel", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaSwipe.prototype, "stop", void 0);
            OaSwipe = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-swipe'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaSwipe);
            exports_1("OaSwipe", OaSwipe);
            OaLongtapSwipe = (function () {
                function OaLongtapSwipe(element) {
                    this.element = element;
                    this.options = {};
                    this.down = function () { };
                    this.start = function () { };
                    this.update = function () { };
                    this.end = function () { };
                    this.cancel = function () { };
                    this.stop = function () { };
                    this.remove = function () { };
                }
                OaLongtapSwipe.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.LongtapSwipe, this.element, this);
                };
                OaLongtapSwipe.prototype.detached = function () {
                    this.remove();
                };
                return OaLongtapSwipe;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "down", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "start", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaLongtapSwipe.prototype, "update", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "end", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "cancel", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaLongtapSwipe.prototype, "stop", void 0);
            OaLongtapSwipe = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-longtap-swipe'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaLongtapSwipe);
            exports_1("OaLongtapSwipe", OaLongtapSwipe);
            OaPinch = (function () {
                function OaPinch(element) {
                    this.element = element;
                    this.options = {};
                    this.down = function () { };
                    this.start = function () { };
                    this.update = function () { };
                    this.end = function () { };
                    this.cancel = function () { };
                    this.stop = function () { };
                    this.remove = function () { };
                }
                OaPinch.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.Pinch, this.element, this);
                };
                OaPinch.prototype.detached = function () {
                    this.remove();
                };
                return OaPinch;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "down", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "start", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaPinch.prototype, "update", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "end", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "cancel", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaPinch.prototype, "stop", void 0);
            OaPinch = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-pinch'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaPinch);
            exports_1("OaPinch", OaPinch);
            OaRotate = (function () {
                function OaRotate(element) {
                    this.element = element;
                    this.options = {};
                    this.down = function () { };
                    this.start = function () { };
                    this.update = function () { };
                    this.end = function () { };
                    this.cancel = function () { };
                    this.stop = function () { };
                    this.remove = function () { };
                }
                OaRotate.prototype.attached = function () {
                    this.remove = oribella_1.oribella.on(oribella_1.Rotate, this.element, this);
                };
                OaRotate.prototype.detached = function () {
                    this.remove();
                };
                return OaRotate;
            }());
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "selector", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "options", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "down", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "start", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable({ primaryProperty: true })
            ], OaRotate.prototype, "update", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "end", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "cancel", void 0);
            tslib_1.__decorate([
                aurelia_templating_1.bindable
            ], OaRotate.prototype, "stop", void 0);
            OaRotate = tslib_1.__decorate([
                aurelia_templating_1.customAttribute('oa-rotate'),
                aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element)
            ], OaRotate);
            exports_1("OaRotate", OaRotate);
        }
    };
});
//# sourceMappingURL=gestures.js.map