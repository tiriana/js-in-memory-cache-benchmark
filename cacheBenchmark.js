const size = 1000000;
const times = 1;

const getData = size => [...Array(size)].reduce((data, key) => (data[Math.random()] = Math.random(), data), {});
const Benchmark = require("benchmark");
let memoryCacheSuite = new Benchmark.Suite("Memoty cache");

const cachesNames = [
    "cache-memory",
    "fast-memory-cache",
    "mem-cache",
    "memory-cache",
    // "memorycache",
    "cache",
    "node-memory-cache",
    "safe-memory-cache",
    "myCache"
];

const caches = cachesNames.reduce(
    (caches, cacheName) => (caches[cacheName] = require(`./src/adapters/${cacheName}`), caches), {}
);

const data = getData(size);

const runTestCase = cache => {
    const keys = Object.keys(data);
    keys.forEach(key => {
        const val = data[key];

        cache.set(val, data[key]);
    });

    keys.forEach(cache.get);

    for (let t = 0; t < 100; t++) {
        const idx = Math.floor(Math.random() * keys.length);

        cache.remove(keys[idx]);
    }
};

const summary = [];

Object.keys(caches).forEach(cacheName => {
    try {
        const now = Date.now();
        for (let t = 0; t < times; t ++) {
            runTestCase(caches[cacheName]);
        }
        summary.push({ name: cacheName, result: Date.now() - now });
    } catch (e) {
        summary.push({ name: cacheName, result: `Throws ${e.message}` });
    };

    // memoryCacheSuite = memoryCacheSuite.add(cacheName, function() {
    //     runTestCase(caches[cacheName]);
    // });
});
//
// memoryCacheSuite.on('complete', function() {
//         console.log('Fastest is ' + this.filter('fastest').map('name'));
//     })
//     .run({
//         'async': true
//     });

summary.sort((a,b) => a.result - b.result);

console.log(summary);
