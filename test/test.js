var assert = require('assert');
var bcp = require('../');

describe('module export', function() {
  it('creates a prompter when called', function() {
    var prompter = bcp({});

    assert(prompter);
  });
});

describe('prompter', function() {
  var prompter, host;

  beforeEach(function() {
    host = {};
    prompter = bcp(host);
  });

  describe('.prompt()', function() {
    it('adds getters to host object based on option keys', function() {
      prompter.prompt({
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

      prompter.prompt({
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
  });
});