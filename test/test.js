var assert = require('assert');
var bcp = require('../');

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
  });
});