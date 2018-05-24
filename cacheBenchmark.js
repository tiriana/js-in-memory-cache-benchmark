const SIZE = 1000000;

const getData = size => [...Array(size)].reduce((data, key) => (data[Math.random()] = Math.random(), data), {});
const data = getData(SIZE);

const cachesNames = [
    "cache-memory",
    "fast-memory-cache",
    "mem-cache",
    "memory-cache",
    // "memorycache", // this one propmts tons of debug data
    "cache",
    "node-memory-cache",
    "safe-memory-cache",
    "myCache"
];

const caches = cachesNames.reduce(
    (caches, cacheName) => (caches[cacheName] = require(`./src/adapters/${cacheName}`), caches), {}
);

const runTestCase = cache => {
    const keys = Object.keys(data);
    keys.forEach(key => {
        const val = data[key];

        cache.set(val, data[key]);
    });

    keys.forEach(cache.get);

    for (let t = 0, l = SIZE / 2; t < l; t++) {
        const idx = Math.floor(Math.random() * keys.length);

        cache.remove(keys[idx]);
    }
};

const summary = [];

Object.keys(caches).forEach(cacheName => {
    const start = Date.now();

    runTestCase(caches[cacheName]);

    summary.push({ lib: cacheName, duration: Date.now() - start });
});

summary.sort((a, b) => a.duration - b.duration);

console.log(summary);

process.exit();
