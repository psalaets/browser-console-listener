var assert = require('assert');
var bcp = require('../');

describe('module export', function() {
  it('creates a listener when called', function() {
    var listener = bcp({});

    assert(listener);
  });
});

describe('listener', function() {
  var listener, host;

  beforeEach(function() {
    host = {};
    listener = bcp(host);
  });

  describe('.listen()', function() {
    it('adds getters to host object based on option keys', function() {
      listener.listen({
        options: [{
          key: 'a'
        }, {
          key: 'b'
        }]
      });

      assert('a' in host);
      assert('b' in host);
    });

    it('invokes callback when a getter on host is accessed', function() {
      var callbackInvoked = false;

      listener.listen({
        options: [{
          key: 'a'
        }, {
          key: 'b'
        }],
        callback: function() {
          callbackInvoked = true;
        }
      });

      host.a;

      assert(callbackInvoked);
    });

    it('passes object of selected option when invoking callback', function() {
      var selectedOption;
      var optionA = {key: 'a'};
      var optionB = {key: 'b'};

      listener.listen({
        options: [optionA, optionB],
        callback: function(selected) {
          selectedOption = selected;
        }
      });

      host.b;

      assert.strictEqual(selectedOption, optionB);
    });

    it('only invokes callback for first getter accessed', function() {
      var callbackParams = [];
      var optionA = {key: 'a'};
      var optionB = {key: 'b'};

      listener.listen({
        options: [optionA, optionB],
        callback: function(selected) {
          callbackParams.push(selected);
        }
      });

      host.b;
      host.a;

      assert.equal(callbackParams.length, 1);
      assert.strictEqual(callbackParams[0], optionB);
    });
  });

  it('can be used for multiple prompt cycles', function() {
    var callbackParams = [];
    var optionA = {key: 'a'};
    var optionB = {key: 'b'};

    listener.listen({
      options: [optionA, optionB],
      callback: function(selected) {
        callbackParams.push(selected);
      }
    });

    host.b;

    assert.equal(callbackParams.length, 1);
    assert.strictEqual(callbackParams[0], optionB);

    listener.listen({
      options: [optionA, optionB],
      callback: function(selected) {
        callbackParams.push(selected);
      }
    });

    host.a;

    assert.equal(callbackParams.length, 2);
    assert.strictEqual(callbackParams[1], optionA);
  });
});