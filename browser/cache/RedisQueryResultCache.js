import { __assign, __awaiter, __generator } from "tslib";
import { PlatformTools } from "../platform/PlatformTools";
import { TypeORMError } from "../error/TypeORMError";
/**
 * Caches query result into Redis database.
 */
var RedisQueryResultCache = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RedisQueryResultCache(connection, clientType) {
        this.connection = connection;
        this.clientType = clientType;
        this.redis = this.loadRedis();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a connection with given cache provider.
     */
    RedisQueryResultCache.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheOptions = this.connection.options.cache;
                        if (!(this.clientType === "redis")) return [3 /*break*/, 3];
                        this.client = this.redis.createClient(__assign(__assign({}, cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.options), { legacyMode: true }));
                        if (!("connect" in this.client)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        if (this.clientType === "ioredis") {
                            if (cacheOptions && cacheOptions.port) {
                                if (cacheOptions.options) {
                                    this.client = new this.redis(cacheOptions.port, cacheOptions.options);
                                }
                                else {
                                    this.client = new this.redis(cacheOptions.port);
                                }
                            }
                            else if (cacheOptions && cacheOptions.options) {
                                this.client = new this.redis(cacheOptions.options);
                            }
                            else {
                                this.client = new this.redis();
                            }
                        }
                        else if (this.clientType === "ioredis/cluster") {
                            if (cacheOptions && cacheOptions.options && Array.isArray(cacheOptions.options)) {
                                this.client = new this.redis.Cluster(cacheOptions.options);
                            }
                            else if (cacheOptions && cacheOptions.options && cacheOptions.options.startupNodes) {
                                this.client = new this.redis.Cluster(cacheOptions.options.startupNodes, cacheOptions.options.options);
                            }
                            else {
                                throw new TypeORMError("options.startupNodes required for ".concat(this.clientType, "."));
                            }
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Disconnects the connection
     */
    RedisQueryResultCache.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.client.quit(function (err, result) {
                            if (err)
                                return fail(err);
                            ok();
                            _this.client = undefined;
                        });
                    })];
            });
        });
    };
    /**
     * Creates table for storing cache if it does not exist yet.
     */
    RedisQueryResultCache.prototype.synchronize = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * Caches given query result.
     * Returns cache result if found.
     * Returns undefined if result is not cached.
     */
    RedisQueryResultCache.prototype.getFromCache = function (options, queryRunner) {
        var _this = this;
        return new Promise(function (ok, fail) {
            if (options.identifier) {
                _this.client.get(options.identifier, function (err, result) {
                    if (err)
                        return fail(err);
                    ok(JSON.parse(result));
                });
            }
            else if (options.query) {
                _this.client.get(options.query, function (err, result) {
                    if (err)
                        return fail(err);
                    ok(JSON.parse(result));
                });
            }
            else {
                ok(undefined);
            }
        });
    };
    /**
     * Checks if cache is expired or not.
     */
    RedisQueryResultCache.prototype.isExpired = function (savedCache) {
        return (savedCache.time + savedCache.duration) < new Date().getTime();
    };
    /**
     * Stores given query result in the cache.
     */
    RedisQueryResultCache.prototype.storeInCache = function (options, savedCache, queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, fail) {
                        if (options.identifier) {
                            _this.client.set(options.identifier, JSON.stringify(options), "PX", options.duration, function (err, result) {
                                if (err)
                                    return fail(err);
                                ok();
                            });
                        }
                        else if (options.query) {
                            _this.client.set(options.query, JSON.stringify(options), "PX", options.duration, function (err, result) {
                                if (err)
                                    return fail(err);
                                ok();
                            });
                        }
                    })];
            });
        });
    };
    /**
     * Clears everything stored in the cache.
     */
    RedisQueryResultCache.prototype.clear = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.client.flushdb(function (err, result) {
                            if (err)
                                return fail(err);
                            ok();
                        });
                    })];
            });
        });
    };
    /**
     * Removes all cached results by given identifiers from cache.
     */
    RedisQueryResultCache.prototype.remove = function (identifiers, queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(identifiers.map(function (identifier) {
                            return _this.deleteKey(identifier);
                        }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Removes a single key from redis database.
     */
    RedisQueryResultCache.prototype.deleteKey = function (key) {
        var _this = this;
        return new Promise(function (ok, fail) {
            _this.client.del(key, function (err, result) {
                if (err)
                    return fail(err);
                ok();
            });
        });
    };
    /**
     * Loads redis dependency.
     */
    RedisQueryResultCache.prototype.loadRedis = function () {
        try {
            if (this.clientType === "ioredis/cluster") {
                return PlatformTools.load("ioredis");
            }
            else {
                return PlatformTools.load(this.clientType);
            }
        }
        catch (e) {
            throw new TypeORMError("Cannot use cache because ".concat(this.clientType, " is not installed. Please run \"npm i ").concat(this.clientType, " --save\"."));
        }
    };
    return RedisQueryResultCache;
}());
export { RedisQueryResultCache };

//# sourceMappingURL=RedisQueryResultCache.js.map
