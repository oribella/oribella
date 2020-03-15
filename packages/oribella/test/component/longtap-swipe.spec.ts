import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from 'oribella-framework';
import { JSDOM } from 'jsdom';
import { registerLongtap } from '../../src/longtap';
import { registerSwipe } from '../../src/swipe';
import { LongtapSwipe, registerLongtapSwipe } from '../../src/longtap-swipe';
import { dispatchMouseEvent } from './utils';
import { Point } from '../../src';

describe('LongtapSwipe', () => {
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
  let setTimeout: sinon.SinonStub;
  let clearTimeout: sinon.SinonSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document = (new JSDOM(html, { url: 'http://localhost' })).window.document;
    const g = global as any;
    setTimeout = sandbox.stub().returns(1);
    clearTimeout = sandbox.spy();

    g.window = {
      document,
      setTimeout,
      clearTimeout,
      ontouchstart: '',
      navigator: {
        msPointerEnabled,
        pointerEnabled,
      },
    };
    instance = new OribellaApi(document);
    instance.registerDefaultFlowStrategy();
    registerLongtap(instance);
    registerSwipe(instance);
    registerLongtapSwipe(instance);
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
    instance.on(LongtapSwipe, target, listener);
    const evt = dispatchMouseEvent(document, target);
    expect(listener.down).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: { pointers: [{ page: new Point(100, 100), client: new Point(100, 100) }] },
    }));
  });

  it('should remove gesture if not longtap time threshold is met', () => {
    instance.on(LongtapSwipe, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mousemove', 250, 250, 250, 250);
    expect(listener.start).not.to.have.been.calledWithExactly();
  });

  it('should call listener start', () => {
    instance.on(LongtapSwipe, target, listener);
    dispatchMouseEvent(document, target);
    setTimeout.callArg(0);
    const evt = dispatchMouseEvent(document, target, 'mousemove', 250, 250, 250, 250);
    expect(listener.start).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: { pointers: [{ client: new Point(250, 250), page: new Point(250, 250) }] },
    }));
  });

  it('should call listener update', () => {
    instance.on(LongtapSwipe, target, listener);
    dispatchMouseEvent(document, target);
    setTimeout.callArg(0);
    dispatchMouseEvent(document, target, 'mousemove', 250, 250, 250, 250);
    const evt = dispatchMouseEvent(document, target, 'mousemove', 300, 300, 300, 300);
    expect(listener.update).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: { pointers: [{ client: new Point(300, 300), page: new Point(300, 300) }] },
    }));
  });

  it('should call listener end', () => {
    instance.on(LongtapSwipe, target, listener);
    dispatchMouseEvent(document, target);
    setTimeout.callArg(0);
    dispatchMouseEvent(document, target, 'mousemove', 250, 250, 250, 250);
    dispatchMouseEvent(document, target, 'mousemove', 300, 300, 300, 300);
    const evt = dispatchMouseEvent(document, target, 'mouseup', 350, 350, 350, 350);
    expect(listener.end.callCount).to.equal(1);
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      target,
      data: { pointers: [{ client: new Point(350, 350), page: new Point(350, 350) }] },
    }));
  });

  it('should call listener cancel', () => {
    instance.on(LongtapSwipe, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'dragstart', 200, 200, 200, 200);
    expect(listener.cancel).to.have.been.calledWithExactly();
  });

});
