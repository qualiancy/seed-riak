var Seed = require('seed')
  , RiakStore = require('..');

suite('CRUD Operations', function () {
  set('type', 'static');
  set('iterations', 50000);
  set('silent', true);

  var UID = new Seed.Flake()
    , keystore = []
    , store = new RiakStore();

  var Rand = Seed.Model.extend('crud', {
    store: store
  });

  bench('create', function (next) {
    var uid = UID.gen()
      , model = new Rand({
          _id: uid
        });
    keystore.push(uid);
    model.save(function (ex) {
      if (ex) throw ex;
      next();
    });
  });

  var readpos = 0;
  bench('read', function (next) {
    var uid = keystore[readpos]
      , model = new Rand({
          _id: uid
        });
    readpos++;
    model.fetch(function (ex) {
      if (ex) throw ex;
      next();
    });
  });

  var updatepos = 0;
  bench('update', function (next) {
    var uid = keystore[updatepos]
      , model = new Rand({
            _id: uid
          , hello: 'world'
        });
    updatepos++;
    model.save(function (ex) {
      if (ex) throw ex;
      next();
    });
  });

  var delpos = 0;
  bench('destroy', function (next) {
    var uid = keystore[delpos]
      , model = new Rand({
          _id: uid
        });
    model.destroy(function (ex) {
      if (ex) throw ex;
      next();
    });
  });
});
