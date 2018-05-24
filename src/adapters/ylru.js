var LRU = require('ylru')

const instance = new LRU(10000000);

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.set(key, undefined);

module.exports = { set, get, remove }
