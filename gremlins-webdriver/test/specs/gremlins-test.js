function loadScript(callback) {
  var s = document.createElement('script');
  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
  if (s.addEventListener) {
    s.addEventListener('load', callback, false);
  } else if (s.readyState) {
    s.onreadystatechange = callback;
  }
  document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
  function stop() {
    horde.stop();
    callback();
  }
  var clickGremlin = null;
  var formGremlin = null;
  var toucGremlin = null;
  var scrollGremlin = null;

  if (window.gremlins) {

    clickGremlin = window.gremlins.species.clicker().clickTypes(['click']);
    clickGremlin.canClick(function (element) {
      return (element.tagName == "A" || element.tagName == "BUTTON") && !element.hidden;
    })

    formGremlin = window.gremlins.species.formFiller();
    formGremlin.canFillElement(function (element) {
      console.log(element.type);
      return (element.tagName == "TEXTAREA" ||
        element.type == "text" ||
        element.type == "password" ||
        element.type == "email") && !element.hidden;
    });

    toucGremlin = window.gremlins.species.toucher();
    toucGremlin.canTouch(function(element){
      return !element.hidden;
    });

    scrollGremlin = window.gremlins.species.scroller();    

  }
  var horde = window.gremlins.createHorde()
    .gremlin(clickGremlin)
    .gremlin(formGremlin)
    .gremlin(toucGremlin)
    .gremlin(scrollGremlin);

  horde.seed(5987);

  horde.strategy(window.gremlins.strategies.distribution()
    .delay(1)
    .distribution([0.7, 0.1, 0.1, 0.1])
  )

  horde.after(callback);
  window.onbeforeunload = stop;
  setTimeout(stop, ttl);
  horde.unleash();


}

browser.waitForPage = function (state, timeout) {
  return browser.waitUntil(function () {
    return state === browser.execute(function () {
      return document.readyState;
    }).value;
  }, timeout);
};

describe('Monkey testing with gremlins ', function () {

  it('Test with monkeys with specific gremlins', function () {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.waitForPage('complete', 3000);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 55000);
  });

  afterAll(function () {
    browser.log('browser').value.forEach(function (log) {
      browser.logger.info(log.message.split(' ')[2]);
    });
  });

});