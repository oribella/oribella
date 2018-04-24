import { OribellaApi } from 'oribella-framework';
import { registerTap } from './tap';
import { registerDoubletap } from './doubletap';
import { registerLongtap } from './longtap';
import { registerSwipe } from './swipe';
import { registerLongtapSwipe } from './longtap-swipe';
import { registerRotate } from './rotate';
import { registerPinch } from './pinch';

export const oribella = new OribellaApi();
export * from './tap';
export * from './doubletap';
export * from './longtap';
export * from './swipe';
export * from './longtap-swipe';
export * from './rotate';
export * from './pinch';

oribella.registerDefaultFlowStrategy();
oribella.activate();
registerTap(oribella);
registerDoubletap(oribella);
registerLongtap(oribella);
registerSwipe(oribella);
registerLongtapSwipe(oribella);
registerRotate(oribella);
registerPinch(oribella);

export * from 'oribella-framework';
