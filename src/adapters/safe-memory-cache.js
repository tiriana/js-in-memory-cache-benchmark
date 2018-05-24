var safeMemoryCache = require('safe-memory-cache');
var instance = safeMemoryCache({ limit: 10000000 });

const set = (key, val) => instance.set(key + "", val);
const get = (key) => instance.get(key + "");
const remove = (key) => instance.set(key + "", undefined); // remove is not supported

module.exports = { set, get, remove }
