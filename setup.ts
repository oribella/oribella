import { use } from 'chai';
import * as sinonChai from 'sinon-chai';
import 'aurelia-polyfills';
import { globalize } from 'aurelia-pal-nodejs';

use(sinonChai);

globalize();
