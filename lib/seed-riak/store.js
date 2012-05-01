var Seed;

try {
  Seed = require('seed');
} catch (e) {
  console.error('Cannot find module seed. Is it installed?');
  process.exit(1);
}

var riak = require('riak-js')
var debug = require('debug')('seed-riak');
var uid = new Seed.ObjectId();

var RiakStore = Seed.Store.extend({
  name: 'RiakStore',

  MIN_SEED_VERSION: '0.2.0',

  initialize: function (options) {
    this.db = riak.getClient(options);
  },

  set: function (seed) {
    var promise = new Seed.Promise();
    var id = seed.data._id;

    if (!id) {
      id = uid.gen();
      seed.data._id = id;
    }

    this.db.save(seed.collection, id, seed.data, function(err) {
      if (err) return promise.reject(err);
      promise.resolve(seed.data);
    });

    return promise.promise;
  },

  get: function (seed) {
    var promise = new Seed.Promise();

    if (!seed.data._id) {
      promise.reject(new Seed.SeedError('No Id defined', { code: 'ENOID' }));
      return promise.promise;
    }

    this.db.get(seed.collection, seed.data._id, function(err, data) {
      if (!data) return promise.resolve();
      if (err) return promise.reject(err);
      promise.resolve(data);
    });

    return promise.promise;
  },

  fetch: function (seed) {
    var promise = new Seed.Promise();
    var query = seed.query || {};

    this.db.getAll(seed.collection, { where: query }, function(err, records) {
      if (err) return promise.reject(err);

      var data = records.map(function(record) {
        return record.data
      });

      promise.resolve(data);
    });

    return promise.promise;
  },

  destroy: function (seed) {
    var promise = new Seed.Promise();

    if (!seed.data._id) {
      promise.reject(new Seed.SeedError('No Id defined', { code: 'ENOID' }));
      return promise.promise;
    }

    this.db.get(seed.collection, seed.data._id, function(err, data) {
      if (err) return promise.reject(err);
      promise.resolve(data);
    });

    return promise.promise;
  },
});

module.exports = RiakStore;
