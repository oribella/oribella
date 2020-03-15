import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from 'oribella-framework';
import { JSDOM } from 'jsdom';
import { Swipe, registerSwipe } from '../../src/swipe';
import { dispatchMouseEvent } from './utils';
import { Point } from '../../src';

describe('Swipe', () => {
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

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document = new JSDOM(html, { url: 'http://localhost' }).window.document;
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
    registerSwipe(instance);
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
    instance.on(Swipe, target, listener);
    const evt = dispatchMouseEvent(document, target);
    expect(listener.down).to.have.been.calledWithExactly(
      sinon.match({
        evt,
        target,
        data: { pointers: [{ page: new Point(100, 100), client: new Point(100, 100) }] },
      })
    );
  });

  it('should call listener start', () => {
    instance.on(Swipe, target, listener);
    dispatchMouseEvent(document, target);
    const evt = dispatchMouseEvent(document, target, 'mousemove', 200, 200, 200, 200);
    expect(listener.start).to.have.been.calledWithExactly(
      sinon.match({
        evt,
        target,
        data: { pointers: [{ client: new Point(200, 200), page: new Point(200, 200) }] },
      })
    );
  });

  it('should call listener update', () => {
    instance.on(Swipe, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mousemove', 250, 250, 250, 250);
    const evt = dispatchMouseEvent(document, target, 'mousemove', 300, 300, 300, 300);
    expect(listener.update).to.have.been.calledWithExactly(
      sinon.match({
        evt,
        target,
        data: { pointers: [{ client: new Point(300, 300), page: new Point(300, 300) }] },
      })
    );
  });

  it('should call listener end', () => {
    instance.on(Swipe, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mousemove', 250, 250, 250, 250);
    dispatchMouseEvent(document, target, 'mousemove', 300, 300, 300, 300);
    const evt = dispatchMouseEvent(document, target, 'mouseup', 350, 350, 350, 350);
    expect(listener.end).to.have.been.calledWithExactly(
      sinon.match({
        evt,
        target,
        data: { pointers: [{ client: new Point(350, 350), page: new Point(350, 350) }] },
      })
    );
  });

  it('should call listener cancel', () => {
    instance.on(Swipe, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'dragstart', 200, 200, 200, 200);
    expect(listener.cancel).to.have.been.calledWithExactly();
  });
});
