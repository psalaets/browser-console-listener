# browser-console-listener

Listen for things typed in the browser console.

## Usage

```js
console.log('Do you like ice cream? (yes or no)');

var bcl = require('browser-console-listener');
var listener = bcl(window);

listener.listen(['yes', 'no'], function(selection) {
  console.log('you said ' + selection + '!');
});
```

## API

### var bcl = require('browser-console-listener')
### var listener = bcl(host)

Create a listener for the given host object. Pass `window` as `host` to achieve the desired effect in browser console.

### listener.listen(answers, callback)

Listen for an answer.

#### answers

Array of strings. A getter will be defined on host object for each answer. There cannot already be a property on host object with same name as any answer.

#### callback

Function invoked when user types an answer. It is passed the selected answer (string).

### listener.cancel()

Stop listening for answers. Remove getters from host object.

## Install

`npm install browser-console-listener`

`bower install browser-console-listener`

## License

MIT