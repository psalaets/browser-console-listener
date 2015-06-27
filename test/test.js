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
      listener.listen(['a', 'b']);

      assert('a' in host);
      assert('b' in host);
    });

    it('throws Error if host has properties with same name as answers', function() {
      host.a = 'already here';

      assert.throws(function() {
        listener.listen(['a', 'b']);
      }, Error);
    });

    it('invokes callback when a getter on host is accessed', function() {
      var callbackInvoked = false;

      listener.listen(['a', 'b'], function() {
        callbackInvoked = true;
      });

      host.a;

      assert(callbackInvoked);
    });

    it('passes selected answer when invoking callback', function() {
      var selectedOption;

      listener.listen(['a', 'b'], function(selected) {
        selectedOption = selected;
      });

      host.b;

      assert.equal(selectedOption, 'b');
    });

    it('only invokes callback for first getter accessed', function() {
      var callbackParams = [];

      listener.listen(['a', 'b'], function(selected) {
        callbackParams.push(selected);
      });

      host.b;
      host.a;

      assert.equal(callbackParams.length, 1);
      assert.equal(callbackParams[0], 'b');
    });
  });

  describe('#cancel()', function () {
    it('cancels a previous listen()', function() {
      listener.listen(['a', 'b'], function(answer) {
        throw new Error('callback should not have fired but it did, arg: ' + answer);
      });

      listener.cancel();

      host.a;
    });

    it('removes getters from host object', function() {
      listener.listen(['a', 'b'], function(answer) {
        throw new Error('callback should not have fired but it did, arg: ' + answer);
      });

      assert('a' in host);
      assert('b' in host);

      listener.cancel();

      assert(!('a' in host));
      assert(!('b' in host));
    });
  });

  it('can start a listen() without canceling previous one', function() {
    var callbackParams = [];

    listener.listen(['a', 'b'], function(selected) {
      throw new Error('first callback should not have fired but it did, arg: ' + answer);
    });

    listener.listen(['c', 'd'], function(selected) {
      callbackParams.push(selected);
    });

    // should have no effect
    host.a;

    host.d;

    assert.equal(callbackParams.length, 1);
    assert.equal(callbackParams[0], 'd');
  });

  it('can be used for multiple prompt cycles', function() {
    var callbackParams = [];

    listener.listen(['a', 'b'], function(selected) {
      callbackParams.push(selected);
    });

    host.b;

    assert.equal(callbackParams.length, 1);
    assert.equal(callbackParams[0], 'b');

    listener.listen(['a', 'b'], function(selected) {
      callbackParams.push(selected);
    });

    host.a;

    assert.equal(callbackParams.length, 2);
    assert.equal(callbackParams[1], 'a');
  });
});