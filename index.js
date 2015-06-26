module.exports = makePrompter;

function makePrompter(host) {
  return {
    prompt: prompt
  };

  function prompt(config) {
    config.options.forEach(function(option) {
      defineGetter(host, option.key, config.callback);
    });


  }

  function defineGetter(host, propertyName, callback) {
    Object.defineProperty(host, propertyName, {
      get: function() {
        callback();
      }
    });
  }
}
