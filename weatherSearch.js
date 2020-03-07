module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://localhost:3000/').maximizeWindow()
      .waitForElementVisible('body', 1000)
      .click('#search')
        .pause(1000)
      .click('#clear')
        .pause(3000)
      .setValue('#street', '1200 w 24th st')
      .setValue('#city', 'Los Angeles')
      .pause(1000)
      .click('select[id="state"]')
        .pause(1000)
        .click('option[value="CA"]')
        
      .waitForElementVisible('#search', 1000)
      .click('#search')
        .pause(1000)
      .execute(function() { window.scrollBy(0, 100000000); }, [])
       .pause(4000)

    //   .assert.containsText('body', 'nightwatch')
      .end();
  }
};