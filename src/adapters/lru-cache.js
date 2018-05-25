var LRU = require('lru-cache')

const instance = LRU({ max: 1000000000 });

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.del(key);

module.exports = { set, get, remove }
