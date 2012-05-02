/**
 * Seed alias.
 */
var Seed;

try {
  Seed = require('seed');
} catch (e) {
  console.error('Cannot find module seed. Is it installed?');
  process.exit(1);
}

/**
 * Riak driver.
 *
 * @type {Object}
 */
var riak = require('joyentriak')

/**
 * ID generator.
 *
 * @type {Object}
 */
var uid = new Seed.ObjectId();

/**
 * Riak Store for Seed.
 */
var RiakStore = Seed.Store.extend({

  /**
   * Name.
   *
   * @type {String}
   */
  name: 'RiakStore',

  /**
   * Min Seed version.
   *
   * @type {String}
   */
  MIN_SEED_VERSION: '0.2.0',

  /**
   * Initialize is called during store construction.
   * You can pass any options to build the Riak driver.
   *
   * @param {Object} options
   */
  initialize: function (options) {
    this.client = riak.getClient(options);
  },

  /**
   * # .set()
   *
   * Create or update.
   *
   * @param {Object} seed
   * @returns {Object} promise
   */
  set: function (seed) {
    var promise = new Seed.Promise();
    var id = seed.data._id;

    if (!id) {
      id = uid.gen();
      seed.data._id = id;
    }

    this.client.save(seed.collection, id, seed.data, function(err) {
      if (err) return promise.reject(err);
      promise.resolve(seed.data);
    });

    return promise.promise;
  },

  /**
   * # .get()
   *
   * Read: Get the value of an entry in the store, by given ID.
   *
   * @param {Object} seed
   * @returns {Object} promise
   */
  get: function (seed) {
    var promise = new Seed.Promise();

    if (!seed.data._id) {
      promise.reject(new Seed.SeedError('No Id defined', { code: 'ENOID' }));
      return promise.promise;
    }

    this.client.get(seed.collection, seed.data._id, function(err, data) {
      if (!data) return promise.resolve();
      if (err) return promise.reject(err);
      promise.resolve(data);
    });

    return promise.promise;
  },

  /**
   * # .fetch()
   *
   * Fetch multiple records found by a given query.
   *
   * @param {Object} seed
   * @returns {Object} promise
   */
  fetch: function (seed) {
    var promise = new Seed.Promise();
    var query = seed.query || {};

    this.client.getAll(seed.collection, { where: query }, function(err, records) {
      if (err) return promise.reject(err);

      var data = records.map(function(record) {
        return record.data
      });

      promise.resolve(data);
    });

    return promise.promise;
  },

  /**
   * # .destroy()
   *
   * Remove an entry from a bucket.
   *
   * @param {Object} seed
   * @returns {Object} promise
   */
  destroy: function (seed) {
    var promise = new Seed.Promise();

    if (!seed.data._id) {
      promise.reject(new Seed.SeedError('No Id defined', { code: 'ENOID' }));
      return promise.promise;
    }

    this.client.remove(seed.collection, seed.data._id, function(err, data) {
      if (err) return promise.reject(err);
      promise.resolve(data);
    });

    return promise.promise;
  },
});

/**
 * Expose `RiakStore`.
 */
module.exports = RiakStore;
