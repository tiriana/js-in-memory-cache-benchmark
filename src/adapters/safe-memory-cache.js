var safeMemoryCache = require('safe-memory-cache');
var instance = safeMemoryCache({});

const set = (key, val) => instance.set(key + "", val);
const get = (key) => instance.get(key + "");
const clear = () => instance.clear();
const remove = (key) => instance.set(key, undefined);

module.exports = { set, get, clear, remove }
