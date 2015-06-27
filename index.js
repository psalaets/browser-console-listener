module.exports = makeListener;

function makeListener(host) {
  var currentAnswers = {};
  var userCallback;

  return {
    listen: listen,
    cancel: reset
  };

  function listen(answers, callback) {
    reset();

    answers.forEach(function(answer) {
      ensureGetter(host, answer);

      currentAnswers[answer] = answer;
    });

    userCallback = callback;
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
      userCallback(answer);
      reset();
    }
  }

  function reset() {
    currentAnswers = {};
    userCallback = null;
  }
}