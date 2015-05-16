export class Handler {
  constructor(element, type, subscriber, active) {
    this.element = element;
    this.type = type;
    this.subscriber = subscriber;
    this.active = active;
  }
  static create(element, type, subscriber) {
    return new Handler(element, type, subscriber);
  }
}
