global.$ = global.jQuery = window.jQuery= require('jquery');
global.objectHash = window.objectHash = require('object-hash');
import './../sass/base.scss';

import 'popper.js';
import './../../node_modules/bootstrap/scss/bootstrap.scss';
import './../../node_modules/bootstrap/js/src/index.js';

$(document).ready(function(){
   console.log('Base global script was loaded correctly.');
});
