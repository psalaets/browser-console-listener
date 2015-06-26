var assert = require('assert');
var bcl = require('../');

describe('module export', function() {
  it('creates a listener when called', function() {
    var listener = bcl({});

    assert(listener);
  });
});

describe('listener', function() {
  var listener, host;

  beforeEach(function() {
    host = {};
    listener = bcl(host);
  });

  describe('#listen()', function() {
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

  describe('#cancel()', function () {
    it('cancels a previous listen()', function() {
      listener.listen({
        answers: ['a', 'b'],
        callback: function(answer) {
          throw new Error('callback should not have fired but it did, arg: ' + answer);
        }
      });

      listener.cancel();

      host.a;
    });
  });

  it('can start a listen() without canceling previous one', function() {
    var callbackParams = [];

    listener.listen({
      answers: ['a', 'b'],
      callback: function(selected) {
        throw new Error('first callback should not have fired but it did, arg: ' + answer);
      }
    });

    listener.listen({
      answers: ['c', 'd'],
      callback: function(selected) {
        callbackParams.push(selected);
      }
    });

    // should have no effect
    host.a;

    host.d;

    assert.equal(callbackParams.length, 1);
    assert.equal(callbackParams[0], 'd');
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