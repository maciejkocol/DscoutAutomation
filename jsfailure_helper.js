
'use strict';

class JSFailure extends Helper {

  // before/after hooks
  _before() {
    this.err = null;
    this.helpers['WebDriverIO'].browser.on('error', (e) => this.err = e);
  }

  _after() {
    if (this.err) throw new Error('Browser JS error '+this.err);
  }

}

module.exports = JSFailure;
