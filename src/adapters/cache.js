const Cache = require("cache");

const instance = new Cache(60 * 60 * 24 * 1000);

const set = (key, val) => instance.put(key, val);
const get = (key) => instance.get(key);
const clear = () => instance.data = {};
const remove = (key) => instance.del(key);

module.exports = { set, get, clear, remove }
