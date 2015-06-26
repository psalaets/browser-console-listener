module.exports = makePrompter;

function makePrompter(host) {
  var optionsByKey = {};
  var callback;

  return {
    prompt: prompt
  };

  function prompt(config) {
    config.options.forEach(function(option) {
      defineGetterByOptionKey(host, option);

      optionsByKey[option.key] = option;
    });

    callback = config.callback;
  }

  function defineGetterByOptionKey(host, option) {
    Object.defineProperty(host, option.key, {
      get: function() {
        runCallbackWithAssociatedOption(option.key);
      }
    });
  }

  function runCallbackWithAssociatedOption(key) {
    var option = optionsByKey[key];

    if (option) {
      callback(option);
      reset();
    }
  }

  function reset() {
    optionsByKey = {};
    callback = null;
  }
}
