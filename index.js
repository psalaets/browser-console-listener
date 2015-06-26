module.exports = makePrompter;

function makePrompter(host) {
  return {
    prompt: prompt
  };

  function prompt(config) {
    config.options.forEach(function(option) {
      defineGetter(host, option.key);
    });
  }

  function defineGetter(host, propertyName) {
    Object.defineProperty(host, propertyName, {
      get: function() {}
    });
  }
}
