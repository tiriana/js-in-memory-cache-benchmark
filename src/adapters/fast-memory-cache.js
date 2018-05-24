const MemoryCache = require("fast-memory-cache");

const instance = new MemoryCache();

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const clear = () => instance.clear();
const remove = (key) => instance.delete(key);

module.exports = { set, get, clear, remove }
