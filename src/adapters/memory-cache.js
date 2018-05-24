const instance = require("memory-cache");

const set = (key, val) => instance.put(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.del(key);

module.exports = { set, get, remove }
