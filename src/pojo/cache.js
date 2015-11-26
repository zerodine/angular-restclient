/**
 *
 */
function Cache() {
    this._cache = {};
    this._ttl = 60 * 1000;
}

/**
 *
 */
Cache.prototype.set = function (key, value) {
    this._cache[key] = {
        timestamp: Date.now(),
        value: value
    }
};

/**
 *
 */
Cache.prototype.get = function(key) {
    if (!angular.isDefined(this._cache[key])) return false;
    if (this._cache[key].timestamp+this._ttl < Date.now()) {
        delete this._cache[key];
        return false;
    }

    return this._cache[key];
};

Cache.prototype.flush = function() {
    this._cache = {};
};