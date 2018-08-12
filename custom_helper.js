'use strict';
let Helper = codecept_helper;

// use any assertion library you like
let assert = require('assert');

class Custom extends Helper {
  /**
   * checks that authentication cookie is set
   */
  async seeAuthentication() {
    // access current client of WebDriverIO helper
    let client = this.helpers['WebDriverIO'].browser;

    // get all cookies according to http://webdriver.io/api/protocol/cookie.html
    // any helper method should return a value in order to be added to promise chain
    const res = await client.cookie();
    // get values
    let cookies = res.value;
    for (let k in cookies) {
      // check for a cookie
      if (cookies[k].name != 'logged_in') continue;
      assert.equal(cookies[k].value, 'yes');
      return;
    }
    assert.fail(cookies, 'logged_in', "Auth cookie not set");
  }
  
}

module.exports = Custom;
