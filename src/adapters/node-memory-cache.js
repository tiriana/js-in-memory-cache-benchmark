const instance = require("node-memory-cache");

const set = (key, val) => instance.set("testCache", key, val);
const get = (key) => instance.get("testCache", key);
const remove = (key) => instance.delete("testCache", key);

module.exports = { set, get, remove }
