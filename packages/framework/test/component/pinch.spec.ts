 import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { JSDOM } from 'jsdom';
import { Pinch, registerPinch } from './gestures/pinch';
import { dispatchTouchEvent } from './utils';
import { Point } from '../../src/point';

describe('Pinch', () => {
  let sandbox: sinon.SinonSandbox;
  let instance: OribellaApi;
  const msPointerEnabled = false;
  const pointerEnabled = false;
  const html = `
    <html>
      <body>
        <div>
          <div></div>
          <div>
            <div class="target"></div>
          </div>
        </div>
      </body>
    </html>
  `;
  let dom: JSDOM;
  let window: Window;
  let document: Document;
  let target: Element;
  let listener: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dom = new JSDOM(html, { url: 'http://localhost' });
    window = dom.window;
    document = window.document;
    const g = global as any;
    g.window = {
      document,
      ontouchstart: '',
      navigator: {
        msPointerEnabled,
        pointerEnabled,
      },
    };
    instance = new OribellaApi(document);
    instance.registerDefaultFlowStrategy();
    registerPinch(instance);
    instance.activate();
    listener = {
      down: sandbox.spy(),
      start: sandbox.spy(),
      update: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy(),
    };

    target = document.querySelector('.target') as Element;
    if (!target) {
      throw new Error(`target not found ${html}`);
    }
  });

  afterEach(() => {
    instance.deactivate();
    sandbox.restore();
  });

  it('should call listener down', () => {
    instance.on(Pinch, target, listener);
    const evt = dispatchTouchEvent(window, document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 },
    ]);
    expect(listener.down).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: {
        pointers: [
          { page: new Point(100, 100), client: new Point(100, 100) },
          { page: new Point(200, 200), client: new Point(200, 200) },
        ],
      },
    }));
  });

  it('should call listener down when fulfilled configured pointers', () => {
    instance.on(Pinch, target, listener);
    dispatchTouchEvent(window, document, target, 'touchstart');
    expect(listener.down.callCount).to.equal(0);
    const evt = dispatchTouchEvent(window, document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 },
    ]);
    expect(listener.down).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: {
        pointers: [
          { page: new Point(100, 100), client: new Point(100, 100) },
          { page: new Point(200, 200), client: new Point(200, 200) },
        ],
      },
    }));
  });

  it('should call listener start', () => {
    instance.on(Pinch, target, listener);
    dispatchTouchEvent(window, document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 },
    ]);
    const evt = dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 },
    ]);
    expect(listener.start).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: {
        pointers: [
          { page: new Point(110, 200), client: new Point(110, 200) },
          { page: new Point(90, 210), client: new Point(90, 210) },
        ],
      },
    }));
  });

  it('should call listener update', () => {
    instance.on(Pinch, target, listener);
    dispatchTouchEvent(window, document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 },
    ]);
    dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 },
    ]);
    const evt = dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 },
    ]);
    expect(listener.update).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: {
        pointers: [
          { page: new Point(115, 200), client: new Point(115, 200) },
          { page: new Point(85, 210), client: new Point(85, 210) },
        ],
      },
    }));
  });

  it('should call listener end', () => {
    instance.on(Pinch, target, listener);
    dispatchTouchEvent(window, document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 },
    ]);
    dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 },
    ]);
    dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 },
    ]);
    const evt = dispatchTouchEvent(window, document, target, 'touchend', [], [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 },
    ]);
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: {
        pointers: [
          { page: new Point(115, 200), client: new Point(115, 200) },
          { page: new Point(85, 210), client: new Point(85, 210) },
        ],
      },
    }));
  });

  it('should call listener end when all locked pointers are removed', () => {
    instance.on(Pinch, target, listener);
    dispatchTouchEvent(window, document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 },
    ]);
    dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 },
    ]);
    dispatchTouchEvent(window, document, target, 'touchmove', [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 },
    ]);
    dispatchTouchEvent(window, document, target, 'touchend',
                       [{ page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }],
                       [{ page: new Point(115, 200), client: new Point(115, 200), identifier: 1 }]);
    const evt = dispatchTouchEvent(window, document, target, 'touchend', [], [
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 },
    ]);
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: {
        pointers: [
          { page: new Point(115, 200), client: new Point(115, 200) },
          { page: new Point(85, 210), client: new Point(85, 210) },
        ],
      },
    }));
  });

});
