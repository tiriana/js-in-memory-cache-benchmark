const instance = require("memory-cache");

const set = (key, val) => instance.put(key, val);
const get = (key) => instance.get(key);
const clear = () => instance.clear();
const remove = (key) => instance.del(key);

module.exports = { set, get, clear, remove }
