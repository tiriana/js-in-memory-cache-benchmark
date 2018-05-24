(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./src/adapters/fast-memory-cache":6,"./src/adapters/hashlru":7,"./src/adapters/safe-memory-cache":8,"./src/adapters/simplest-cache":9,"./src/adapters/ylru":10}],2:[function(require,module,exports){
'use strict';

/**
 * Provides in-memory cache.
 *
 * @name MemoryCache
 * @constructor
 */
function MemoryCache() {
    this._cache = createMap();
    this._timeouts = createMap();
}

/**
 * Returns cache value for the specified key.
 *
 * @param {String} key
 * @returns {*} Value or `undefined` if value does not exist.
 */
MemoryCache.prototype.get = function (key) {
    return this._cache[key];
};

/**
 * Assigns value for the specified key.
 *
 * @param {String} key
 * @param {*} value
 * @param {Number} [expireTime=0] The length of time in seconds. After this time has expired, the
 *      value will be automatically deleted. 0 means that time never expire.
 */
MemoryCache.prototype.set = function (key, value, expireTime) {
    this.delete(key);
    this._cache[key] = value;
    if (expireTime) {
        this._timeouts[key] = setTimeout(this.delete.bind(this, key), expireTime * 1000);
    }
};

/**
 * Deletes value for the specified key.
 *
 * @param {String} key
 */
MemoryCache.prototype.delete = function (key) {
    delete this._cache[key];
    if (key in this._timeouts) {
        clearTimeout(this._timeouts[key]);
        delete this._timeouts[key];
    }
};

/**
 * Clears the whole cache storage.
 */
MemoryCache.prototype.clear = function () {
    this._cache = createMap();
    for (var key in this._timeouts) {
        clearTimeout(this._timeouts[key]);
    }
    this._timeouts = createMap();
};

/**
 * Creates a new object without a prototype. This object is useful for lookup without having to
 * guard against prototypically inherited properties via hasOwnProperty.
 *
 * @returns {Object}
 */
function createMap() {
    return Object.create(null);
}

module.exports = MemoryCache;

},{}],3:[function(require,module,exports){
module.exports = function (max) {

  if (!max) throw Error('hashlru must have a max value, of type number, greater than 0')

  var size = 0, cache = Object.create(null), _cache = Object.create(null)

  function update (key, value) {
    cache[key] = value
    size ++
    if(size >= max) {
      size = 0
      _cache = cache
      cache = Object.create(null)
    }
  }

  return {
    has: function (key) {
      return cache[key] !== undefined || _cache[key] !== undefined
    },
    remove: function (key) {
      if(cache[key] !== undefined)
        cache[key] = undefined
      if(_cache[key] !== undefined)
        _cache[key] = undefined
    },
    get: function (key) {
      var v = cache[key]
      if(v !== undefined) return v
      if((v = _cache[key]) !== undefined) {
        update(key, v)
        return v
      }
    },
    set: function (key, value) {
      if(cache[key] !== undefined) cache[key] = value
      else update(key, value)
    },
    clear: function () {
      cache = Object.create(null)
      _cache = Object.create(null)
    }
  }
}








},{}],4:[function(require,module,exports){
function createMem(number, limit) {
    var mem = Object.create(bucketsProto)
    mem.N = number
    mem.max = limit
    mem.clear()
    return mem
}

var bucketsProto = {
    clear: function clear() {
        this.size = 0
        this.buckets=[];
        for (var i = 0; i < this.N; i++) {
            this.spawnBucket()
        }
    },
    spawnBucket: function spawnBucket() {
        this.buckets.unshift(Object.create(null))
    },
    rotateBuckets: function rotateBuckets() {
        var dropped = this.buckets.pop()
        this.spawnBucket()
        this.size = 0
        if(this.rotationHook){
            this.rotationHook(dropped)
        }
    },
    set: function set(key, value) {
        if (!(key in this.buckets[0])) {
            this.size++;
            if (this.max && this.size >= Math.ceil(this.max / this.buckets.length)) {
                this.rotateBuckets()
            }
        }
        this.buckets[0][key] = value
        return value
    },
    get: function get(key) {
        for (var i = 0; i < this.buckets.length; i++) {
            if (key in this.buckets[i]) {
                //todo: this should be configurable
                if (i) {
                    //put a reference in the newest bucket
                    return this.set(key,this.buckets[i][key])
                }
                return this.buckets[i][key]
            }
        }
    }
}

var protoRegex = /__proto__/g;

function sanitizeSimple(key) {
    return '' + key.replace(protoRegex, 'z__proto__')
}

function sanitizeHeavy(key) {
    return ('' + key).split('').map(function(char) {
        return char.charCodeAt(0).toString(32)
    }).join('z')
}


module.exports = function(opts) {
    var buckets = ~~(opts.buckets) || 2;
    var mem = createMem(buckets, opts.limit)
    mem.rotationHook = opts.cleanupListener || null
    var sanitize = (opts.strongSanitizer ? sanitizeHeavy : sanitizeSimple)

    if (opts.maxTTL) {
        var intervalHandle = setInterval(mem.rotateBuckets.bind(mem), ~~(opts.maxTTL / buckets))
    }

    return {
        set: function(key, value) {
            return mem.set(sanitize(key), value)
        },
        get: function(key) {
            return mem.get(sanitize(key))
        },
        clear: mem.clear.bind(mem),
        destroy: function() {
            mem.rotationHook = null
            clearInterval(intervalHandle)
        },
        _get_buckets: function(){
            return mem.buckets
        },
        _rotate_buckets: function() {
            return mem.rotateBuckets()
        }
    }


}

},{}],5:[function(require,module,exports){
'use strict';

class LRU {
  constructor(max) {
    this.max = max;
    this.size = 0;
    this.cache = new Map();
    this._cache = new Map();
  }

  get(key, options) {
    let item = this.cache.get(key);
    const maxAge = options && options.maxAge;
    if (item) {
      const now = Date.now();
      // check expired
      if (item.expired && now > item.expired) {
        item.expired = 0;
        item.value = undefined;
      } else {
        // update expired in get
        if (maxAge !== undefined) {
          const expired = maxAge ? now + maxAge : 0;
          item.expired = expired;
        }
      }
      return item.value;
    }

    // try to read from _cache
    item = this._cache.get(key);
    if (item) {
      const now = Date.now();
      // check expired
      if (item.expired && now > item.expired) {
        item.expired = 0;
        item.value = undefined;
      } else {
        // not expired, save to cache
        this._update(key, item);
        // update expired in get
        if (maxAge !== undefined) {
          const expired = maxAge ? now + maxAge : 0;
          item.expired = expired;
        }
      }
      return item.value;
    }
  }

  set(key, value, options) {
    const maxAge = options && options.maxAge;
    const expired = maxAge ? Date.now() + maxAge : 0;
    let item = this.cache.get(key);
    if (item) {
      item.expired = expired;
      item.value = value;
    } else {
      item = {
        value,
        expired,
      };
      this._update(key, item);
    }
  }

  keys() {
    const cacheKeys = new Set();
    const now = Date.now();

    for (const entry of this.cache.entries()) {
      checkEntry(entry);
    }

    for (const entry of this._cache.entries()) {
      checkEntry(entry);
    }

    function checkEntry(entry) {
      const key = entry[0];
      const item = entry[1];
      if (entry[1].value && (!entry[1].expired) || item.expired >= now) {
        cacheKeys.add(key);
      }
    }

    return Array.from(cacheKeys.keys());
  }

  _update(key, item) {
    this.cache.set(key, item);
    this.size++;
    if (this.size >= this.max) {
      this.size = 0;
      this._cache = this.cache;
      this.cache = new Map();
    }
  }
}

module.exports = LRU;

},{}],6:[function(require,module,exports){
const MemoryCache = require("fast-memory-cache");

const instance = new MemoryCache();

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.delete(key);

module.exports = { set, get, remove }

},{"fast-memory-cache":2}],7:[function(require,module,exports){
var HLRU = require('hashlru')

const instance = HLRU(10000000);

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.remove(key + "");

module.exports = { set, get, remove }

},{"hashlru":3}],8:[function(require,module,exports){
var safeMemoryCache = require('safe-memory-cache');
var instance = safeMemoryCache({ limit: 10000000 });

const set = (key, val) => instance.set(key + "", val);
const get = (key) => instance.get(key + "");
const remove = (key) => instance.set(key + "", undefined); // remove is not supported

module.exports = { set, get, remove }

},{"safe-memory-cache":4}],9:[function(require,module,exports){
const map = {};

const set = (key, val) => map[key] = val
const get = (key) => map[key];
const remove = (key) => delete map[key]

module.exports = { set, get, remove };

},{}],10:[function(require,module,exports){
var LRU = require('ylru')

const instance = new LRU(10000000);

const set = (key, val) => instance.set(key, val);
const get = (key) => instance.get(key);
const remove = (key) => instance.set(key, undefined);

module.exports = { set, get, remove }

},{"ylru":5}]},{},[1]);
