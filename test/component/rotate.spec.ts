import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi, Point } from 'oribella-framework';
import { jsdom } from 'jsdom';
import { Rotate, registerRotate } from '../../src/rotate';
import { dispatchTouchEvent } from './utils';

describe('Rotate', () => {
  let sandbox: Sinon.SinonSandbox;
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
  let document: Document;
  let target: Element;
  let listener: any;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    document = jsdom(html);
    const g = global as any;
    g.window = {
      ontouchstart: '',
      document,
      navigator: {
        msPointerEnabled,
        pointerEnabled
      }
    };
    instance = new OribellaApi();
    instance.registerDefaultFlowStrategy();
    registerRotate(instance);
    instance.activate();
    listener = {
      down: sandbox.spy(),
      start: sandbox.spy(),
      update: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy()
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
    instance.on(Rotate, target, listener);
    const evt = dispatchTouchEvent(document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 }
    ]);
    expect(listener.down).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: {
        pointers: [
          { page: { x: 100, y: 100 }, client: { x: 100, y: 100 } },
          { page: { x: 200, y: 200 }, client: { x: 200, y: 200 } }
        ]
      },
      target
    }));
  });

  it('should call listener down when fulfilled configured pointers', () => {
    instance.on(Rotate, target, listener);
    dispatchTouchEvent(document, target, 'touchstart');
    expect(listener.down).not.to.have.been.called;
    const evt = dispatchTouchEvent(document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 }
    ]);
    expect(listener.down).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: {
        pointers: [
          { page: { x: 100, y: 100 }, client: { x: 100, y: 100 } },
          { page: { x: 200, y: 200 }, client: { x: 200, y: 200 } }
        ]
      },
      target
    }));
  });

  it('should call listener start', () => {
    instance.on(Rotate, target, listener);
    dispatchTouchEvent(document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 }
    ]);
    const evt = dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 }
    ]);
    expect(listener.start).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: {
        pointers: [
          { page: { x: 110, y: 200 }, client: { x: 110, y: 200 } },
          { page: { x: 90, y: 210 }, client: { x: 90, y: 210 } }
        ]
      },
      target
    }));
  });

  it('should call listener update', () => {
    instance.on(Rotate, target, listener);
    dispatchTouchEvent(document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 }
    ]);
    dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 }
    ]);
    const evt = dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }
    ]);
    expect(listener.update).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: {
        pointers: [
          { page: { x: 115, y: 200 }, client: { x: 115, y: 200 } },
          { page: { x: 85, y: 210 }, client: { x: 85, y: 210 } }
        ]
      },
      target
    }));
  });

  it('should call listener end', () => {
    instance.on(Rotate, target, listener);
    dispatchTouchEvent(document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 }
    ]);
    dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 }
    ]);
    dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }
    ]);
    const evt = dispatchTouchEvent(document, target, 'touchend', [], [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }
    ]);
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: {
        pointers: [
          { page: { x: 115, y: 200 }, client: { x: 115, y: 200 } },
          { page: { x: 85, y: 210 }, client: { x: 85, y: 210 } }
        ]
      },
      target
    }));
  });

  it('should call listener end when all locked pointers are removed', () => {
    instance.on(Rotate, target, listener);
    dispatchTouchEvent(document, target, 'touchstart', [
      { page: new Point(100, 100), client: new Point(100, 100), identifier: 1 },
      { page: new Point(200, 200), client: new Point(200, 200), identifier: 2 }
    ]);
    dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(110, 200), client: new Point(110, 200), identifier: 1 },
      { page: new Point(90, 210), client: new Point(90, 210), identifier: 2 }
    ]);
    dispatchTouchEvent(document, target, 'touchmove', [
      { page: new Point(115, 200), client: new Point(115, 200), identifier: 1 },
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }
    ]);
    dispatchTouchEvent(document, target, 'touchend',
      [{ page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }],
      [{ page: new Point(115, 200), client: new Point(115, 200), identifier: 1 }]);
    const evt = dispatchTouchEvent(document, target, 'touchend', [], [
      { page: new Point(85, 210), client: new Point(85, 210), identifier: 2 }
    ]);
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: {
        pointers: [
          { page: { x: 115, y: 200 }, client: { x: 115, y: 200 } },
          { page: { x: 85, y: 210 }, client: { x: 85, y: 210 } }
        ]
      },
      target
    }));
  });

});
