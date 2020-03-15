import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { JSDOM } from 'jsdom';
import { Tap, registerTap } from './gestures/tap';
import { dispatchMouseEvent } from './utils';
import { Point } from '../../src';

describe('Tap', () => {
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
  let document: Document;
  let target: Element;
  let listener: any;
  let myListener: any;
  class MyListener { }

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document = (new JSDOM(html, { url: 'http://localhost' })).window.document;
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
    registerTap(instance);
    instance.activate();
    listener = {
      start: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy(),
    };
    myListener = new MyListener();
    myListener.start = sandbox.spy();
    target = document.querySelector('.target') as Element;
    if (!target) {
      throw new Error(`target not found ${html}`);
    }
  });

  afterEach(() => {
    instance.deactivate();
    sandbox.restore();
  });

  it('should call listener start', () => {
    instance.on(Tap, target, myListener);
    const evt = dispatchMouseEvent(document, target);
    expect(myListener.start).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: { pointers: [{ page: new Point(100, 100), client: new Point(100, 100) }] },
    }));
  });

  it('should call listener cancel', () => {
    instance.on(Tap, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mousemove', 200, 200, 200, 200);
    expect(listener.cancel).to.have.been.calledWithExactly();
  });

  it('should call listener end', () => {
    instance.on(Tap, target, listener);
    dispatchMouseEvent(document, target);
    const evt = dispatchMouseEvent(document, target, 'mouseup');
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: { pointers: [{ page: new Point(100, 100), client: new Point(100, 100) }] },
    }));
  });

});
