const caches = {
    // "cache-memory": require("./src/adapters/cache-memory"),
    "fast-memory-cache": require("./src/adapters/fast-memory-cache"),
    // "mem-cache": require("./src/adapters/mem-cache"), // this one is VEEERYYY slow
    // "memory-cache": require("./src/adapters/memory-cache"),
    // "memorycache": require("./src/adapters/memorycache"), // this one propmts tons of debug data
    // "cache": require("./src/adapters/cache"),
    // "node-memory-cache": require("./src/adapters/node-memory-cache"), // This one is the slowest
    "safe-memory-cache": require("./src/adapters/safe-memory-cache"),
    "simplest-cache": require("./src/adapters/simplest-cache"),
    "hashlru": require("./src/adapters/hashlru"),
    "ylru": require("./src/adapters/ylru")
};

const benchmark = SIZE => {
    const getData = size => [...Array(size)].reduce((data, key) => (data[Math.random()] = Math.random(), data), {});
    const data = getData(SIZE);

    const runTestCase = cache => {
        const keys = Object.keys(data);

        // caching values
        keys.forEach(key => cache.set(key, data[key]));

        // getting values
        keys.forEach(cache.get);

        // removing half of values
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
