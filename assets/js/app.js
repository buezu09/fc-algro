import polyfills from './polyfills/index.js';
import '../scss/global.scss';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import '../stimulus_bootstrap.js';

UIkit.use(Icons);

const app = () => {
    // Make UIkit accessible via browser console
    global.UIkit = UIkit;
};

Promise.all(polyfills).then(app);
