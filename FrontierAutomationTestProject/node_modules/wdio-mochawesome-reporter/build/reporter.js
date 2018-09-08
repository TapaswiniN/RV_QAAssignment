'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = require('events');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var stringify = require('json-stringify-safe');
var uuidV4 = require('uuid/v4');
var BuildTestResult = require('./TestResult');

/**
 * Initialize a new `Mochawesome` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

/* Note:
* Hierarchy of the WDIO reporting is: runner > spec > suite > test
*/

var WdioMochawesomeReporter = function (_events$EventEmitter) {
    _inherits(WdioMochawesomeReporter, _events$EventEmitter);

    function WdioMochawesomeReporter(baseReporter, config) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, WdioMochawesomeReporter);

        var _this = _possibleConstructorReturn(this, (WdioMochawesomeReporter.__proto__ || Object.getPrototypeOf(WdioMochawesomeReporter)).call(this));

        _this.baseReporter = baseReporter;
        _this.config = config;
        _this.options = options;

        var epilogue = _this.baseReporter.epilogue;


        _this.on('end', function () {
            // statistics about overall execution results
            var stats = {
                'suites': 0,
                'tests': 0,
                'passes': 0,
                'pending': 0,
                'failures': 0,
                'start': _this.baseReporter.stats.start,
                'end': _this.baseReporter.stats.end,
                'duration': _this.baseReporter.stats._duration,
                'testsRegistered': 0,
                'passPercent': 0,
                'pendingPercent': 0,
                'other': 0,
                'hasOther': false,
                'skipped': 0,
                'hasSkipped': false,
                'passPercentClass': 'success',
                'pendingPercentClass': 'danger'

                // structure for mochawesome json reporter
            };var results = {
                stats: stats,
                suites: [],
                allTests: [],
                allPending: [],
                allPasses: [],
                allFailures: [],
                copyrightYear: new Date().getFullYear()

                // build the mochawesome root suite.
            };var rootSuite = _this.buildSuite(true, { 'title': '' });
            results.suites = rootSuite;

            // runner loop
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(_this.baseReporter.stats.runners)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cid = _step.value;

                    var runnerInfo = _this.baseReporter.stats.runners[cid];
                    var sanitizedCapabilities = runnerInfo.sanitizedCapabilities;

                    // specs loop
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.keys(runnerInfo.specs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var specId = _step2.value;

                            var specInfo = runnerInfo.specs[specId];

                            // suites loop
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = Object.keys(specInfo.suites)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var suiteName = _step3.value;

                                    var suiteInfo = specInfo.suites[suiteName];

                                    // exclude before all and after all 'suites'
                                    if (!suiteInfo.uid.includes('before all') && !suiteInfo.uid.includes('after all') && Object.keys(suiteInfo.tests).length > 0) {
                                        suiteInfo.sanitizedCapabilities = sanitizedCapabilities;
                                        var suiteResult = _this.buildSuite(false, suiteInfo);

                                        // tests loop
                                        var _iteratorNormalCompletion4 = true;
                                        var _didIteratorError4 = false;
                                        var _iteratorError4 = undefined;

                                        try {
                                            for (var _iterator4 = Object.keys(suiteInfo.tests)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                                var testName = _step4.value;

                                                var testResult = BuildTestResult(suiteInfo.tests[testName], suiteResult.uuid, _this.config, runnerInfo.sessionID);
                                                suiteResult.tests.push(testResult);
                                                results.allTests.push(testResult);
                                                if (testResult.pass) {
                                                    suiteResult.passes.push(testResult);
                                                    results.allPasses.push(testResult);
                                                } else if (testResult.fail) {
                                                    suiteResult.failures.push(testResult);
                                                    results.allFailures.push(testResult);
                                                } else if (testResult.pending) {
                                                    suiteResult.pending.push(testResult);
                                                    results.allPending.push(testResult);
                                                }
                                            }
                                        } catch (err) {
                                            _didIteratorError4 = true;
                                            _iteratorError4 = err;
                                        } finally {
                                            try {
                                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                                    _iterator4.return();
                                                }
                                            } finally {
                                                if (_didIteratorError4) {
                                                    throw _iteratorError4;
                                                }
                                            }
                                        }

                                        suiteResult.totalTests = suiteResult.tests.length;
                                        suiteResult.hasTests = suiteResult.tests.length > 0;
                                        suiteResult.totalPasses = suiteResult.passes.length;
                                        suiteResult.hasPasses = suiteResult.passes.length > 0;
                                        suiteResult.totalFailures = suiteResult.failures.length;
                                        suiteResult.hasFailures = suiteResult.failures.length > 0;
                                        suiteResult.totalPending = suiteResult.pending.length;
                                        suiteResult.hasPending = suiteResult.pending.length > 0;

                                        results.suites.suites.push(suiteResult);
                                        results.stats.tests += suiteResult.totalTests;
                                        results.stats.testsRegistered += suiteResult.totalTests;
                                        results.stats.passes += suiteResult.totalPasses;
                                        results.stats.failures += suiteResult.totalFailures;
                                        results.stats.pending += suiteResult.totalPending;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                        _iterator3.return();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }

                            results.stats.suites = results.suites.suites.length;
                            results.suites.hasSuites = results.suites.suites.length > 0;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }

                // calculate percentages for overall summary
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            results.stats.passPercent = results.stats.tests === 0 ? 0 : Math.round(results.stats.passes / results.stats.tests * 100);
            results.stats.pendingPercent = results.stats.tests === 0 ? 0 : Math.round(results.stats.pending / results.stats.tests * 100);

            _this.write(results);

            epilogue.call(baseReporter);
        });
        return _this;
    }

    // creates a new suite object to be added to the results


    _createClass(WdioMochawesomeReporter, [{
        key: 'buildSuite',
        value: function buildSuite(isRoot, data) {
            var suite = {
                'title': '',
                'suites': [],
                'tests': [],
                'pending': [],
                'root': isRoot,
                'fullFile': '',
                'file': '',
                'passes': [],
                'failures': [],
                'skipped': [],
                'hasTests': false,
                'hasSuites': false,
                'totalTests': 0,
                'totalPasses': 0,
                'totalFailures': 0,
                'totalPending': 0,
                'totalSkipped': 0,
                'hasPasses': false,
                'hasFailures': false,
                'hasPending': false,
                'hasSkipped': false,
                'duration': 0,
                'rootEmpty': data.rootEmpty,
                '_timeout': 0,
                'uuid': uuidV4(),
                'hasBeforeHooks': false,
                'beforeHooks': [],
                'hasAfterHooks': false,
                'afterHooks': []
            };

            if (!isRoot) {
                suite.title = data.title;

                if (data.sanitizedCapabilities) {
                    suite.title = suite.title + ' (' + data.sanitizedCapabilities + ')';
                }

                if (data._duration) {
                    suite.duration = data._duration;
                }
            }

            return suite;
        }

        // outputs json and html reports

    }, {
        key: 'write',
        value: function write(json) {
            if (!this.options || typeof this.options.outputDir !== 'string') {
                return console.log('Cannot write json report: empty or invalid \'outputDir\'.');
            }

            try {
                var dir = path.resolve(this.options.outputDir);
                var filename = this.options.mochawesome_filename ? this.options.mochawesome_filename : 'wdiomochawesome.json';
                var filepath = path.join(dir, filename);
                mkdirp.sync(dir);
                fs.writeFileSync(filepath, JSON.stringify(json));
                console.log('Wrote json report to [' + this.options.outputDir + '].');
            } catch (e) {
                console.log('Failed to write json report to [' + this.options.outputDir + ']. Error: ' + e);
            }
        }
    }]);

    return WdioMochawesomeReporter;
}(events.EventEmitter);

exports.default = WdioMochawesomeReporter;
module.exports = exports['default'];