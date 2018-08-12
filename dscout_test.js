/// <reference path="./steps.d.ts" />

  // use an assertion library
  let assert = require('assert');

  // define data table
  let accounts = new DataTable([
    'email',
    'password'
  ]); //
  
  // add record to table
  accounts.add([
    'automation@tester.com', 
    'dontbreakthebuild'
  ]);
  
  Feature('Sign In');
  
  Before((I, signinPage) => {
    I.clearCookie();
    I.amOnPage(signinPage.url);
    I.seeInTitle('Sign In - dscout'); // verify page title
  });

  Scenario('verify elements on page', (I, signinPage) => {

    // verify text
    I.see('Sign in to dscout');
    I.see("Don't have an account?");

    // verify image
    I.seeElement(signinPage.images.logo);

    // verify email and password labels
    I.seeElement(signinPage.labels.email); 
    I.seeElement(signinPage.labels.password);
    
    // verify email and password fields
    I.seeElement(signinPage.fields.email); 
    I.seeElement(signinPage.fields.password);

    // verify email and password placeholders
    I.seeElement(signinPage.placeholders.email); 
    I.seeElement(signinPage.placeholders.email);

    // verify sign in button
    I.seeElement(signinPage.buttons.signin);

    // verify links
    I.seeElement(signinPage.links.signin_sso);
    I.seeElement(signinPage.links.forgot_password);
    I.seeElement(signinPage.links.signup);

  });
  
  Scenario('verify sso sign in link', (I, signinPage, signinSSOPage) => {
    I.click(signinPage.links.signin_sso);
    I.seeInCurrentUrl(signinSSOPage.url);
    I.see("Use your organization's SSO credentials");
  });

  Scenario('verify forgot password link', (I, signinPage, resetPasswordPage) => {
    I.click(signinPage.links.forgot_password);
    I.seeInCurrentUrl(resetPasswordPage.url);
    I.see("Reset Password");
  });

  Scenario('verify sign up link', (I, signinPage, signupPage) => {
    I.click(signinPage.links.signup);
    I.seeInCurrentUrl(signupPage.url);
    I.see("In-Context Insights");
  });

  Data(accounts).Scenario('verify successful sign in', (I, signinPage, dashboardPage, current) => {
    signinPage.sendForm(current.email, current.password);
    I.waitInUrl(dashboardPage.url);
    I.see("Getting Started");
  });

  Scenario('verify empty email and password sign in', async(I, signinPage) => {
    signinPage.sendForm('', '');
    I.seeInCurrentUrl(signinPage.url);
    assert.equal(signinPage.fields.email.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Data(accounts).Scenario('verify empty email sign in', async(I, signinPage, current) => {
    signinPage.sendForm('', current.password);
    I.seeInCurrentUrl(signinPage.url);
    assert.equal(signinPage.fields.email.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Data(accounts).Scenario('verify empty password sign in', async(I, signinPage, current) => {
    signinPage.sendForm(current.email, '');
    I.seeInCurrentUrl(signinPage.url);
    assert.equal(signinPage.fields.password.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Data(accounts).Scenario("verify missing '@' email sign in", async(I, signinPage, current) => {
    signinPage.sendForm(current.email.replace('@', ''), current.password);
    I.seeInCurrentUrl(signinPage.url);    
    assert.equal(signinPage.fields.email.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Data(accounts).Scenario("verify incomplete part following '@' email sign in", async(I, signinPage, current) => {
    signinPage.sendForm(current.email.substring(0, current.email.indexOf('@')+1), current.password);
    I.seeInCurrentUrl(signinPage.url);
    assert.equal(signinPage.fields.email.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Data(accounts).Scenario("verify invalid credentials sign in", async(I, signinPage, current) => {
    signinPage.sendForm(current.email.slice(0, -1), current.password);
    I.seeInCurrentUrl(signinPage.url);
    I.seeElement("//div[@class='blitz alert']//span[text()='Invalid Email or password.']");
    assert.equal(signinPage.fields.email.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Data(accounts).Scenario("verify locked account", async(I, signinPage, current) => {
    signinPage.sendForm("abc@abc.com", current.password);
    I.seeInCurrentUrl(signinPage.url);
    I.seeElement("//div[@class='blitz alert']//span[contains(text(), 'Your account has been locked')]");
    assert.equal(signinPage.fields.email.name, await I.grabFocusedElementId());
    I.see("Sign in to dscout");
  });

  Feature('Sign In - API');
  
  Data(accounts).Scenario('verify POST - successful sign in - 302', async(I, signinPage, current) => {
    let resp = await I.sendPostRequest(signinPage.url, {
        "user[email]": current.email,
        "user[password]": current.password
    });
    assert.equal(resp["code"], "302");
  });

  Data(accounts).Scenario('verify GET - SSO sign in - 200', async(I, signinSSOPage, current) => {
    let resp = await I.sendGetRequest(signinSSOPage.url);
    assert.equal(resp["code"], "200");
  });

  Data(accounts).Scenario('verify GET - Forgot Password - 200', async(I, resetPasswordPage, current) => {
    let resp = await I.sendGetRequest(resetPasswordPage.url);
    assert.equal(resp["code"], "200");
  });

  Data(accounts).Scenario('verify GET - Sign up - 301', async(I, signupPage, current) => {
    let resp = await I.sendGetRequest(signupPage.url);
    assert.equal(resp["code"], "301");
  });
