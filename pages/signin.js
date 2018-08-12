'use strict';

let I;

module.exports = {

  _init() {
    I = require('../steps_file.js')();
  },
  
  // setting locators
  labels: {
    email: {xpath: '//label[text()="Email"]'},
    password: {xpath: '//label[text()="Password"]'}
  },
  fields: {
    email: {
      name: 'user[email]',
      xpath: '//input[@name=' + this.name + ']'
    },
    password: {
      name: 'user[password]',
      xpath: '//input[@name=' + this.name + ']'
    },
  },
  placeholders: {
    email: {xpath: '//input[@placeholder="you@example.com"]'},
    password: {xpath: '//input[@placeholder="**********"]'}
  },
  buttons: {
    signin: {xpath: '//input[@type="submit" and @class="button"]'},
  },
  links: {
    signup: {xpath: '//a[text()="Sign Up"]'},
    signin_sso: {xpath: '//a[text()="Sign in with SSO"]'},
    forgot_password: {xpath: '//a[text()="Forgot your password?"]'},
  },
  images: {
    logo: {xpath: '//img[@alt="dscout"]'},
  },
  url: '/sign_in',

  // submit signin form
  sendForm(email, password) {

    // enter email
    I.fillField(this.fields.email, email);

    // enter password
    I.fillField(this.fields.password, password);

    // click sign in
    I.click(this.buttons.signin);

  },

}
