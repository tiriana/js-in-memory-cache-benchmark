const instance = require("node-memory-cache");

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const clear = () => instance.populate({});
const remove = (key) => instance.delete(key);

module.exports = { set, get, clear, remove }
