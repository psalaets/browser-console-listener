module.exports = makeListener;

function makeListener(host) {
  var currentAnswers = {};
  var userCallback;

  return {
    listen: listen,
    cancel: reset
  };

  function listen(answers, callback) {
    if (!Array.isArray(answers)) {
      throw new Error('answers must be an Array');
    }

    if (typeof callback != 'function') {
      throw new Error('callback must be a function');
    }

    reset();

    answers.forEach(function(answer) {
      createGetter(host, answer);

      currentAnswers[answer] = answer;
    });

    userCallback = callback;
  }

  function createGetter(host, answer) {
    if (answer in host) {
      throw new Error('Property is already defined on host object, host[\'' + answer + '\'] is: ' + host[answer]);
    }

    Object.defineProperty(host, answer, {
      get: function() {
        runCallbackForAnswer(answer);
      },
      configurable: true
    });
  }

  function runCallbackForAnswer(answer) {
    if (answer in currentAnswers) {
      userCallback(answer);
      reset();
    }
  }

  function reset() {
    for (var answer in currentAnswers) {
      delete host[answer];
    }

    currentAnswers = {};
    userCallback = null;
  }
}