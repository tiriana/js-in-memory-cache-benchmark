var Cache = require('mem-cache');
var instance = new Cache();

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.remove(key);

module.exports = { set, get, remove }
