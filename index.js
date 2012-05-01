module.exports = process.env.SEEDRIAK_COV
  ? require('./lib-cov/seed-riak')
  : require('./lib/seed-riak');
