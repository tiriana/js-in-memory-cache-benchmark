const caches = {
    "cache-memory": require("./src/adapters/cache-memory"),
    "fast-memory-cache": require("./src/adapters/fast-memory-cache"),
    // "mem-cache": require("./src/adapters/mem-cache"), // this one is VEEERrr slow
    "memory-cache": require("./src/adapters/memory-cache"),
    // "memorycache": require("./src/adapters/memorycache"), // this one propmts tons of debug data
    "cache": require("./src/adapters/cache"),
    "node-memory-cache": require("./src/adapters/node-memory-cache"),
    "safe-memory-cache": require("./src/adapters/safe-memory-cache"),
    "simplest-cache": require("./src/adapters/simplest-cache")
};

const benchmark = SIZE => {
    const getData = size => [...Array(size)].reduce((data, key) => (data[Math.random()] = Math.random(), data), {});
    const data = getData(SIZE);

    const runTestCase = cache => {
        const keys = Object.keys(data);
        keys.forEach(key => {
            const val = data[key];

            cache.set(key, data[key]);
        });

        keys.forEach(key => {
            if (cache.get(key) !== data[key]) {
                throw new Error(`${key} - got ${cache.get(key)}, expected ${data[key]}` );
            }
        });

        for (let t = 0, l = SIZE / 2; t < l; t++) {
            const idx = Math.floor(Math.random() * keys.length);

            cache.remove(keys[idx]);
        }
    };

    const summary = [];

    Object.keys(caches).forEach(cacheName => {
        const start = Date.now();
        try {
            runTestCase(caches[cacheName]);
            summary.push({ lib: cacheName, duration: Date.now() - start });
        } catch (e) {
            summary.push({ lib: cacheName, error: e.message, duration: Number.MAX_SAFE_INTEGER });
        }

    });

    summary.sort((a, b) => a.duration - b.duration);

    return summary;
}

module.exports = benchmark;

if (typeof window !== 'undefined') {
  window.cacheBenchmark = benchmark;
}
