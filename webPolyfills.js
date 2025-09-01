// webPolyfills.js
if (typeof global === 'undefined') {
  window.global = window;
}

if (!global.Buffer) {
  global.Buffer = require('buffer').Buffer;
}

if (!global.process) {
  global.process = require('process/browser');
}