import { Oribella } from 'oribella-framework';
import { register as registerTap } from './tap';
import { register as registerDoubletap } from './doubletap';
import { register as registerLongtap } from './longtap';
import { register as registerSwipe } from './swipe';
import { register as registerLongtapSwipe } from './longtap-swipe';
import { register as registerRotate } from './rotate';
import { register as registerPinch } from './pinch';

export const oribella = new Oribella();

oribella.registerDefaultFlowStrategy();
registerTap(oribella);
registerDoubletap(oribella);
registerLongtap(oribella);
registerSwipe(oribella);
registerLongtapSwipe(oribella);
registerRotate(oribella);
registerPinch(oribella);
