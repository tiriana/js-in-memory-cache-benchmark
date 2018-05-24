const MemoryCache = require("fast-memory-cache");

const instance = new MemoryCache();

const set = (key, val) => instance.set(Symbol(key), val);
const get = (key) => instance.get(Symbol(key));
const remove = (key) => instance.delete(Symbol(key));

module.exports = { set, get, remove }
