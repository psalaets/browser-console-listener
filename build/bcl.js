(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.browserConsoleListener = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = makeListener;

function makeListener(host) {
  var currentAnswers = {};
  var callback;

  return {
    listen: listen,
    cancel: reset
  };

  function listen(config) {
    reset();

    config.answers.forEach(function(answer) {
      ensureGetter(host, answer);

      currentAnswers[answer] = answer;
    });

    callback = config.callback;
  }

  function ensureGetter(host, answer) {
    if (answer in host) return;

    Object.defineProperty(host, answer, {
      get: function() {
        runCallbackForAnswer(answer);
      }
    });
  }

  function runCallbackForAnswer(answer) {
    if (answer in currentAnswers) {
      callback(answer);
      reset();
    }
  }

  function reset() {
    currentAnswers = {};
    callback = null;
  }
}

},{}]},{},[1])(1)
});