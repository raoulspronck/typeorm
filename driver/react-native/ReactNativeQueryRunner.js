"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactNativeQueryRunner = void 0;
var tslib_1 = require("tslib");
var QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
var QueryFailedError_1 = require("../../error/QueryFailedError");
var AbstractSqliteQueryRunner_1 = require("../sqlite-abstract/AbstractSqliteQueryRunner");
var Broadcaster_1 = require("../../subscriber/Broadcaster");
var QueryResult_1 = require("../../query-runner/QueryResult");
/**
 * Runs queries on a single sqlite database connection.
 */
var ReactNativeQueryRunner = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ReactNativeQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ReactNativeQueryRunner(driver) {
        var _this = _super.call(this) || this;
        _this.driver = driver;
        _this.connection = driver.connection;
        _this.broadcaster = new Broadcaster_1.Broadcaster(_this);
        return _this;
    }
    /**
     * Called before migrations are run.
     */
    ReactNativeQueryRunner.prototype.beforeMigration = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("PRAGMA foreign_keys = OFF")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Called after migrations are run.
     */
    ReactNativeQueryRunner.prototype.afterMigration = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("PRAGMA foreign_keys = ON")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Executes a given SQL query.
     */
    ReactNativeQueryRunner.prototype.query = function (query, parameters, useStructuredResult) {
        var _this = this;
        if (useStructuredResult === void 0) { useStructuredResult = false; }
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        return new Promise(function (ok, fail) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var databaseConnection, queryStartTime;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        databaseConnection = _a.sent();
                        this.driver.connection.logger.logQuery(query, parameters, this);
                        queryStartTime = +new Date();
                        databaseConnection.executeSql(query, parameters, function (raw) {
                            // log slow queries if maxQueryExecution time is set
                            var maxQueryExecutionTime = _this.driver.options.maxQueryExecutionTime;
                            var queryEndTime = +new Date();
                            var queryExecutionTime = queryEndTime - queryStartTime;
                            if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime)
                                _this.driver.connection.logger.logQuerySlow(queryExecutionTime, query, parameters, _this);
                            var result = new QueryResult_1.QueryResult();
                            // return id of inserted row, if query was insert statement.
                            if (query.substr(0, 11) === "INSERT INTO") {
                                result.raw = raw.insertId;
                            }
                            if (raw === null || raw === void 0 ? void 0 : raw.hasOwnProperty('rowsAffected')) {
                                result.affected = raw.rowsAffected;
                            }
                            if (raw === null || raw === void 0 ? void 0 : raw.hasOwnProperty('rows')) {
                                var records = [];
                                for (var i = 0; i < raw.rows.length; i++) {
                                    records.push(raw.rows.item(i));
                                }
                                result.raw = records;
                                result.records = records;
                            }
                            if (useStructuredResult) {
                                ok(result);
                            }
                            else {
                                ok(result.raw);
                            }
                        }, function (err) {
                            _this.driver.connection.logger.logQueryError(err, query, parameters, _this);
                            fail(new QueryFailedError_1.QueryFailedError(query, parameters, err));
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    ReactNativeQueryRunner.prototype.parametrize = function (objectLiteral, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        return Object.keys(objectLiteral).map(function (key, index) { return "\"".concat(key, "\"") + "=?"; });
    };
    return ReactNativeQueryRunner;
}(AbstractSqliteQueryRunner_1.AbstractSqliteQueryRunner));
exports.ReactNativeQueryRunner = ReactNativeQueryRunner;

//# sourceMappingURL=ReactNativeQueryRunner.js.map
