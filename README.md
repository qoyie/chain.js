# chain.js

## Download

 * [CDN copies](https://cdn.jsdelivr.net/gh/qoyie/chain.js) [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/gh/qoyie/chain.js/badge)](https://www.jsdelivr.com/package/gh/qoyie/chain.js)

## Installation

In a browser:
```html
<script src="chain.js"></script>
<!--
or
<script src="chain.min.js">
<script src="chain.lite.js">
<script src="chain.lite.min.js">
-->
```

Using Github CLI:
```shell
$ gh repo clone qoyie/chain.js
```

In Node.js:
```js
// Load the full build.
var chain = require('chain-cjs.js');
// Load the lite build.
var chain = require('chain-cjs.lite.js');

// ES6 module
import chain from 'chain-mjs.js';
import chain from 'chain-mjs.lite.js';
```

## Why chain.js?

Chain.js makes JavaScript easier by taking the hassle out of working with deep nesting.

## Examples

```js
chain('3')
.then(parseInt)
.then(i=>i*i)
.then(String)
.then(console.log,console); // lite version: .then(console.log.bind(console));
// => "9"

chain('1,2,3')
.then(str=>str.split(','))
.then(array=>array.map(e=>parseInt(e)))
.forEach(console.log,console);
// => 1
// => 2
// => 3

chain(1==2)
.if(()=>console.log('1==2 is true'))
.elif(()=>0==1,()=>console.log('0==1 is true'))
.else(()=>console.log('1==2 is not true'));
// => "1==2 is not true"

chain(0).for(i=>i<3,i=>i+1,i=>{
  console.log(i);
})
.else(()=>console.log('No loops'));
// => 0
// => 1
// => 2

chain().while(()=>false,()=>{
  console.log('Loop');
})
.else(()=>console.log('No loops'));
// => "No loops"

chain('Some string').try(str=>{
  console.log(str);
  throw new Error(str);
})
.catch(e=>console.log("Error thrown: "+e))
.else(v=>console.log("Success. Return value: "+v))
.then(e=>console.log(Object.prototype.toString(e)));
// => "Some string"
// => "Error thrown: Error: Some string"
// => [object Object]

chain('Some string').try(str=>{
  console.log(str);
  return str;
})
.catch(e=>console.log("Error thrown: "+e))
.else(v=>console.log("Success. Return value: "+v))
.then(e=>console.log(Object.prototype.toString(e)));
// => "Some string"
// => "Success. Return value: Some string"
// => "Some string"
```
