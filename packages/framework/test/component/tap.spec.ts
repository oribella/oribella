import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { JSDOM } from 'jsdom';
import { Tap, registerTap } from './gestures/tap';
import { dispatchMouseEvent } from './utils';

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
    sandbox = sinon.sandbox.create();
    document = (new JSDOM(html)).window.document;
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
    registerTap(instance);
    instance.activate();
    listener = {
      start: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy()
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
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
      target
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
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
      target
    }));
  });

});
