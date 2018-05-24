const map = {};

const set = (key, val) => map[key] = val
const get = (key) => map[key];
const remove = (key) => delete map[key]

module.exports = { set, get, remove };
