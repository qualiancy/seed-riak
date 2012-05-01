# Seed Riak

This module provides a storage engine for [Seed](http://github.com/qualiancy/seed) that allows
datasets to be stored in Riak.

## Installation

Module is available through npm. To use it in your project you must also have `seed` installed,
as it is not provided as `package.json` requirement.

      npm install seed seed-riak

## What is Seed?

[Seed](http://github.com/qualiancy/seed), which stands for _storage-agnostic, event emitting datasets_,
is a library of components that provide a common API for working with data, no matter the source.
These compoents are Hash, Model, Graph, and Schema. Riak can be one the many sources used in
the construction eventful, data-centric applications.

[Visit the Seed project page](http://github.com/qualiancy/seed) to learn more.

## Usage

This storage engine can be used for both models and collections. 

```js
var Seed = require('seed')
  , RiakStore = require('seed-riak')
  , store = new RiakStore();

var Person = Seed.Model.extend('person', {
  store: store
});

var arthur = new Person({
    id: 'arthur'
  , name: 'Arthur Dent'
  , occupation: 'Traveller'
});

arthur.save(function (err) {
  if (err) return console.error(err);
  console.log('Arthur has been saved!');
});
```

## Querying

When fetching from a Graph, the queries are passed directly to the riak database, and should
follow Riak's format.

```js
var HitchhikersGuide = Seed.Graph.extend({
    store: store
  , initialize: function () {
      this.define(Person);
    }
});

var myGuide = new HitchhikersGuide();
myGuide.fetch('person', { 'name': 'Arthur Dent' }, function (err) {
  var arthur = self.get('/person/arthur');
});
```

## Tests

Tests are writting in [Mocha](http://github.com/visionmedia/mocha) using the [Chai](http://chaijs.com)
`should` BDD assertion library. Make sure you have that installed, clone this repo, install dependacies using `npm install`.

    $ make test

You will also need a local installation of Riak available on. Custom
test database options are not provided by default.

## Getting Help

All issues related to this project should be posted in [seed-riak GitHub Issues](https://github.com/qualiancy/seed-riak/issues).
For all general seed related issues, please visit [seed's GitHub Issues](https://github.com/qualiancy/seed/issues).
There is also a community forum is available at the [Seed Google Group](https://groups.google.com/group/seedjs-orm).

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) 
if you are interested in being regular contributor.

* Veselin Todorov ([Github: @vesln](http://github.com/vesln)) ([Twitter: @vesln](http://twitter.com/vesln))
* Jake Luer ([Github: @logicalparadox](http://github.com/logicalparadox)) ([Twitter: @jakeluer](http://twitter.com/jakeluer)) ([Website](http://alogicalparadox.com))

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
