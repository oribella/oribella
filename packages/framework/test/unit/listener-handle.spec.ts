import { expect } from 'chai';
import { ListenerHandle } from '../../src/listener-handle';
import { DefaultListener } from '../../src/listener';
import { Gesture } from '../../src/gesture';

describe('Listener handle', () => {
  it('should be a constructor', () => {
    expect(ListenerHandle).to.throw();
  });

  it('should set element, type, subscriber, active', () => {
    const element = {};
    const listener = {};
    // class Foo extends DefaultGesture {};
    const handle = new ListenerHandle(Gesture, element as Element, listener as DefaultListener);
    expect(handle.element).to.equal(element);
    expect(handle.GestureClass).to.equal(Gesture);
    expect(handle.listener).to.equal(listener);
  });
});
