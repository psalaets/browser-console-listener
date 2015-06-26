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
    it('adds a getter to host object for each answer', function() {
      listener.listen({
        answers: ['a', 'b']
      });

      assert('a' in host);
      assert('b' in host);
    });

    it('invokes callback when a getter on host is accessed', function() {
      var callbackInvoked = false;

      listener.listen({
        answers: ['a', 'b'],
        callback: function() {
          callbackInvoked = true;
        }
      });

      host.a;

      assert(callbackInvoked);
    });

    it('passes selected answer when invoking callback', function() {
      var selectedOption;

      listener.listen({
        answers: ['a', 'b'],
        callback: function(selected) {
          selectedOption = selected;
        }
      });

      host.b;

      assert.equal(selectedOption, 'b');
    });

    it('only invokes callback for first getter accessed', function() {
      var callbackParams = [];

      listener.listen({
        answers: ['a', 'b'],
        callback: function(selected) {
          callbackParams.push(selected);
        }
      });

      host.b;
      host.a;

      assert.equal(callbackParams.length, 1);
      assert.equal(callbackParams[0], 'b');
    });
  });

  it('can be used for multiple prompt cycles', function() {
    var callbackParams = [];

    listener.listen({
      answers: ['a', 'b'],
      callback: function(selected) {
        callbackParams.push(selected);
      }
    });

    host.b;

    assert.equal(callbackParams.length, 1);
    assert.equal(callbackParams[0], 'b');

    listener.listen({
      answers: ['a', 'b'],
      callback: function(selected) {
        callbackParams.push(selected);
      }
    });

    host.a;

    assert.equal(callbackParams.length, 2);
    assert.equal(callbackParams[1], 'a');
  });
});