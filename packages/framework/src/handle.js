export class Handle {
  constructor(element, type, subscriber, active) {
    this.element = element;
    this.type = type;
    this.subscriber = subscriber;
    this.active = active;
  }
}
