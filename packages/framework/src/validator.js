export class Validator {
  constructor(isMouse) {
    this.isMouse = isMouse;
  }
  isValidMouseButton(event, allowedBtn) {
    var btn = event.button,
      which = event.which,
      actualBtn;

    actualBtn = (!which && btn !== undefined) ?
                  (btn & 1 ? 1 : (btn & 2 ? 3 : (btn & 4 ? 2 : 0))) :
                  which;
    return Array.isArray(allowedBtn) ? allowedBtn.some(function (val) {
      return actualBtn === val;
    }) : actualBtn === allowedBtn;
  }
  hasMoreTouches(pagePoints, touches) {
    return pagePoints.length > touches;
  }
  hasEqualTouches(pagePoints, touches) {
    return pagePoints.length === touches;
  }
  start(event, data, options) {
    if (this.isMouse(event) && !this.isValidMouseButton(event, options.which)) {
      return false;
    }
    if (this.hasMoreTouches(data.pagePoints, options.touches)) {
      return false;
    }
    return true;
  }
  update(event, data, options) {
    if (this.hasMoreTouches(data.pagePoints, options.touches)) {
      return false;
    }
    if (this.hasEqualTouches(data.pagePoints, options.touches)) {
      return true;
    }
    return undefined;
  }
  end(event, data, options) {
    return this.hasEqualTouches(data.pagePoints, options.touches);
  }
}
