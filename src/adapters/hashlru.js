var HLRU = require('hashlru')

const instance = HLRU(10000000);

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.remove(key + "");

module.exports = { set, get, remove }
