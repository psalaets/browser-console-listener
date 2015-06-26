module.exports = makeListener;

function makeListener(host) {
  var currentAnswers = {};
  var callback;

  return {
    listen: listen,
    cancel: reset
  };

  function listen(config) {
    config.answers.forEach(function(answer) {
      ensureGetter(host, answer);

      currentAnswers[answer] = answer;
    });

    callback = config.callback;
  }

  function ensureGetter(host, answer) {
    if (answer in host) return;

    Object.defineProperty(host, answer, {
      get: function() {
        runCallbackForAnswer(answer);
      }
    });
  }

  function runCallbackForAnswer(answer) {
    if (answer in currentAnswers) {
      callback(answer);
      reset();
    }
  }

  function reset() {
    currentAnswers = {};
    callback = null;
  }
}
