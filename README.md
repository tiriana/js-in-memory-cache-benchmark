# Small benchmark I made to find out best suiting in-memory cache.
(live demo: https://tiriana.github.io/js-in-memory-cache-benchmark/)

## Used libs
*   [cache-memory](https://www.npmjs.com/package/cache-memory)
*   [fast-memory-cache](https://www.npmjs.com/package/fast-memory-cache)
*   [mem-cache](https://www.npmjs.com/package/mem-cache)
*   [memorycache](https://www.npmjs.com/package/memorycache)
*   [cache](https://www.npmjs.com/package/cache)
*   [node-memory-cache](https://www.npmjs.com/package/node-memory-cache)
*   [safe-memory-cache](https://www.npmjs.com/package/safe-memory-cache)
*   simplest-cache

simplest-cache is my implementation and it's the most straight forward and naive in-memory implementation I could think of:
```javascript
const map = {};
const set = (key, val) => map[key] = val
const get = (key) => map[key];
const remove = (key) => delete map[key]
const clear = () => map = {}
```
## Results

### TL;DR;

| Lib / feature | get | set | remove | clear | global TTL | per value TTL | max size limit |
| - |:-:|:-:|:-:|:-:|:-:|:-:|-:|
| simplest-cache | yes | yes | yes | yes | no | no | no |
| fast-memory-cache | yes | yes | yes | yes | no | yes | no |
| safe-memory-cache | yes | yes | no | yes | yes | no | yes |

* If you just need `get`, `set`, `remove` - just write your version of `simplest-cache` (or use the one above)
* If you need TTL (Time To Live) per value - use `fast-memory-cache`
* If you need to control MAX size of your cache - use `safe-memory-cache`. It also supports global TTL (but no TTL per value). But it does not support `remove`

### Detailed results
(duration is in ms)

#### for 10000 elements

```json
[
  {
    "lib": "simplest-cache",
    "duration": 3
  },
  {
    "lib": "fast-memory-cache",
    "duration": 8
  },
  {
    "lib": "safe-memory-cache",
    "duration": 9
  },
  {
    "lib": "cache",
    "duration": 11
  },
  {
    "lib": "memory-cache",
    "duration": 13
  },
  {
    "lib": "cache-memory",
    "duration": 74
  },
  {
    "lib": "mem-cache",
    "duration": 161
  },
  {
    "lib": "node-memory-cache",
    "duration": 4754
  },
  {
    "lib": "memorycache",
    "duration": 16388
  }
]
```

#### for 1000000 elements
(without `mem-cache`, `memorycache` and `node-memory-cache` as they were too slow)

```json
[
  {
    "lib": "simplest-cache",
    "duration": 1106
  },
  {
    "lib": "fast-memory-cache",
    "duration": 1226
  },
  {
    "lib": "memory-cache",
    "duration": 1392
  },
  {
    "lib": "safe-memory-cache",
    "duration": 1449
  },
  {
    "lib": "cache",
    "duration": 1692
  },
  {
    "lib": "cache-memory",
    "duration": 7215
  }
]
```

#### for 2000000 elements
(without `cache-memory`)

```json
[
  {
    "lib": "simplest-cache",
    "duration": 2235
  },
  {
    "lib": "fast-memory-cache",
    "duration": 2362
  },
  {
    "lib": "memory-cache",
    "duration": 2747
  },
  {
    "lib": "safe-memory-cache",
    "duration": 2925
  },
  {
    "lib": "cache",
    "duration": 3761
  }
]
```

#### for 3000000 elements
(without `memory-cache` and `cache`)

```json
[
  {
    "lib": "simplest-cache",
    "duration": 4341
  },
  {
    "lib": "fast-memory-cache",
    "duration": 4511
  },
  {
    "lib": "safe-memory-cache",
    "duration": 4810
  }
]
```

## Conclusion

Differences in time for `fast-memory-cache`, `safe-memory-cache` and `simplest-cache` are very insignificant. So you just need to choose one based on other features which you need and they do or don't provide.
