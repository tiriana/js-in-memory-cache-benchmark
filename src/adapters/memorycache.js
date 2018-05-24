const instance = require("memorycache").create(10000000);

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const clear = () => instance.reset();
const remove = (key) => instance.delete(key);

module.exports = { set, get, clear, remove }
