const cache = require("cache-memory");

const instance = cache.create({ id: "test" });

const set = (key, val) => instance.set(key + "", val);
const get = (key) => instance.get(key + "");
const remove = (key) => instance.remove(key + "");

module.exports = { set, get, remove }
