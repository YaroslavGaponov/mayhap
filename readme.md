MayHap
=========

a quick search for the word in his top

Example
----

```javascript

var Mayhap = require('./libs/mayhap.js');
console.log(
    Mayhap()
        .add('hi')
        .add('hello')
        .add('hallo')
        .add('bye')
        .suggest('he', 5)
);

```