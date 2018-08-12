'use strict';

let I;

module.exports = {

  _init() {
    I = require('../steps_file.js')();
  },

  // setting locators
  url: '/sign_in/sso'

}
