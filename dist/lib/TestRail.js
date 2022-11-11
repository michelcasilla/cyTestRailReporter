"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// import axiosFormData from 'axios-form-data';
var chalk_1 = require("chalk");
var FormData = require('form-data');
var fs = require('fs');
var TestRailsInterfaces_1 = require("./TestRailsInterfaces");
var TestRails = /** @class */ (function () {
    function TestRails(auth, runId, host) {
        this.tagIds = [];
        this.missingCases = [];
        this.reports = [];
        this.caseTestMap = {};
        this.log = [];
        this.host = host + "/index.php?/api/v2";
        this.conf = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            auth: auth,
            log: true
        };
        this.buckect = [];
        if (runId) {
            this.runId = runId;
            // @TODO catch the response somewhere wo we dont have to call the endpoint
            this.loadTestRailRunData();
        }
    }
    /**
     *
     * @param projectId the projectid to be used
     * @returns Chainable
     * @describe Returns a list of test runs for a project. Only returns those test runs that are not part of a test plan (please see get_plans/get_plan for this).
     */
    TestRails.prototype.getRun = function (runId) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "GET";
        requestConfg.url = this.host + "/get_run/" + runId;
        return this.__call(requestConfg);
    };
    /**
     *
     * @param projectId the projectid to be used
     * @returns Chainable
     * @describe Returns a list of test runs for a project. Only returns those test runs that are not part of a test plan (please see get_plans/get_plan for this).
     */
    TestRails.prototype.getRuns = function (projectId) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "GET";
        requestConfg.url = this.host + "/get_runs/" + projectId;
        return this.__call(requestConfg);
    };
    /**
     *
     * @param projectId The projectId
     * @param payload AddRunPayload instance
     * @returns Chainable
     * @describe Creates a new test run.
     */
    TestRails.prototype.addRun = function (projectId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var requestConfg, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestConfg = __assign({}, this.conf);
                        requestConfg.method = "POST";
                        requestConfg.url = this.host + "/add_run/" + projectId;
                        requestConfg.body = payload;
                        return [4 /*yield*/, this.__call(requestConfg)];
                    case 1:
                        response = _a.sent();
                        this.runId = response.id;
                        this.run = response;
                        return [4 /*yield*/, this.loadTestRailRunData()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     *
     * @param runId The runID
     * @param payload And instance of UpdateRunPayload
     * @returns Chainable
     * @describe Updates an existing test run (partial updates are supported, i.e. you can submit and update specific fields only).
     * in you want to add more cases to the run.
     */
    TestRails.prototype.updateRun = function (runId, payload) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "POST";
        requestConfg.url = this.host + "/update_run/" + runId;
        requestConfg.body = payload;
        return this.__call(requestConfg);
    };
    /**
     *
     * @param runId The runId
     * @returns Chainable
     * @describe Closes an existing test run and archives its tests & results.
     */
    TestRails.prototype.closeRun = function (runId) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "POST";
        requestConfg.url = this.host + "/close_run/" + runId;
        return this.__call(requestConfg);
    };
    /**
     *
     * @param runId The run if to delete
     * @param payload Including soft=1 will not actually delete the entity.
     * @returns
     * @describe This action is permanent, it delets all the information related to the runID. can't be undone
     */
    TestRails.prototype.deleteRun = function (runId, payload) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "POST";
        requestConfg.url = this.host + "/delete_run/" + runId;
        requestConfg.body = payload;
        return this.__call(requestConfg);
    };
    /**
     *
     * @param runId the runid to be used
     * @returns
     */
    TestRails.prototype.getTests = function (runId, searchParams) {
        if (searchParams === void 0) { searchParams = ""; }
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "GET";
        requestConfg.url = this.host + "/get_tests/" + runId + searchParams;
        return this.__call(requestConfg);
    };
    /**
     *
     * @param projectId the projectId
     * @param suiteId the suitId
     * @returns
     */
    TestRails.prototype.getCases = function (projectId, suiteId) {
        var _this = this;
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "GET";
        requestConfg.url = this.host + "/get_cases/" + projectId;
        if (suiteId) {
            requestConfg.url = requestConfg.url + ("&suite_id=" + suiteId);
        }
        return this.__call(requestConfg).then(function (rsp) {
            _this.cases = rsp.cases;
        });
    };
    /**
     *
     * @param caseId the caseId
     * @returns
     * @description get information about and specific case
     */
    TestRails.prototype.getCase = function (caseId) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "GET";
        requestConfg.url = this.host + "/get_case/" + caseId;
        return this.__call(requestConfg);
    };
    TestRails.prototype.getCaseStatuses = function () {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "GET";
        requestConfg.url = this.host + "/get_case_statuses";
        return this.__call(requestConfg);
    };
    TestRails.prototype.addResultForCase = function (runId, caseId, result) {
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "POST";
        requestConfg.url = this.host + "/add_result_for_case/" + runId + "/" + caseId;
        requestConfg.body = result;
        return this.__call(requestConfg);
    };
    TestRails.prototype.addResult = function (testId, result) {
        console.log(chalk_1.default.green("Sending result for " + testId));
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "POST";
        requestConfg.url = this.host + "/add_result/" + testId;
        requestConfg.body = result;
        return this.__call(requestConfg);
    };
    TestRails.prototype.addAttachmentResult = function (testId, file) {
        return __awaiter(this, void 0, void 0, function () {
            var name, form;
            return __generator(this, function (_a) {
                file = '/Users/michel.casilla/Documents/MCT/A-SCENDTestRailReporter/reporters/testrail/README.md';
                name = file.split('/').slice(-1);
                console.log(chalk_1.default.green("Sending attachment " + name + " for " + testId));
                form = new FormData();
                form.append('attachment', fs.createReadStream(file), name);
                console.log(chalk_1.default.gray(this.host + "/add_attachment_to_result/" + testId));
                return [2 /*return*/, axios_1.default.post(this.host + "/add_attachment_to_result/" + testId, form, {
                        headers: __assign({}, form.getHeaders()),
                        auth: this.conf.auth
                    }).then(function (response) {
                        console.log(chalk_1.default.green('File uploaded: ' + JSON.stringify(response.data)));
                    }).catch(function (error) {
                        console.error(error);
                    })];
            });
        });
    };
    TestRails.prototype.updateTestIdStatus = function (testId, status, comment, customVideoResult) {
        if (customVideoResult === void 0) { customVideoResult = TestRails.customVideoResult; }
        var requestConfg = __assign({}, this.conf);
        requestConfg.method = "POST";
        requestConfg.url = this.host + "/add_result/" + testId;
        var data = {
            "status_id": status,
            comment: comment,
            "custom_resultsvideo": customVideoResult,
            "custom_userinformation": "e1",
        };
        requestConfg.body = data;
        return this.__call(requestConfg);
    };
    TestRails.prototype.reportTestResult = function (test) {
        var report = this.getReportFromTest(test);
        if (report) {
            this.addResult(report.tagId, report.report);
        }
    };
    TestRails.prototype.reportFeatureResult = function (test, sendResultForEachUser) {
        if (sendResultForEachUser === void 0) { sendResultForEachUser = false; }
        var parent = test.parent;
        var testsQueue = parent.testsQueue;
        this.collect(test);
        if (testsQueue.length) {
            if (sendResultForEachUser) {
                this.reportTestResult(test);
            }
        }
        else {
            this.report();
        }
    };
    TestRails.prototype.report = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, payload, testIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.missingCases.length) return [3 /*break*/, 4];
                        keys = Object.keys(this.caseTestMap).map(function (x) { return Number(x); });
                        payload = {
                            "case_ids": this.missingCases.concat(keys),
                            'include_all': false
                        };
                        return [4 /*yield*/, this.updateRun(this.runId, payload)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTestRailRunData()];
                    case 2:
                        _a.sent();
                        testIds = this.getTestIdsFromCaseId(this.missingCases).testIds;
                        // this.tagIds = Cypress._.uniq((this.tagIds || []).concat(testIds));
                        this.tagIds = (this.tagIds || []).concat(testIds);
                        // resolve(true)
                        return [4 /*yield*/, this.reportCollected()];
                    case 3:
                        // resolve(true)
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.reportCollected()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TestRails.prototype.reportCollected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fail, totalS, status, stepResults, comment, report, _i, _a, tagId, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fail = this.reports.some(function (report) { return report.status_id !== TestRailsInterfaces_1.TestRailStatusIds.passed; });
                        totalS = this.getReportElapsedTime();
                        status = fail ? TestRailsInterfaces_1.TestRailStatusIds.failed : TestRailsInterfaces_1.TestRailStatusIds.passed;
                        stepResults = this.getSteps();
                        comment = this.getStepsComment();
                        report = {
                            "status_id": status,
                            comment: comment,
                            elapsed: totalS,
                            "custom_step_results": stepResults,
                            "custom_resultsvideo": TestRails.customVideoResult,
                        };
                        _i = 0, _a = this.tagIds;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        tagId = _a[_i];
                        return [4 /*yield*/, this.addResult(tagId, report)];
                    case 2:
                        result = _b.sent();
                        return [4 /*yield*/, this.addAttachmentResult(result.id, '/fixtures/todo.cy.js.mp4')];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TestRails.prototype.getReportElapsedTime = function () {
        var millis = this.reports.reduce(function (acc, report) {
            return (acc += Number(report.elapsed));
        }, 0);
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000);
        return (minutes + seconds > 0) ? minutes + "M " + seconds.toFixed(0) + "S" : "1S";
    };
    TestRails.prototype.collect = function (test) {
        console.log(chalk_1.default.gray("Collecting " + test.title));
        var report = this.getReportFromTest(test);
        if (report) {
            this.currentTagID = report.tagId;
            this.tagIds = report.testIds || [];
            this.missingCases = report.missingCases;
            if (!this.isPendingImplementationError(report)) {
                this.reports.push(report.report);
            }
        }
    };
    TestRails.prototype.isPendingImplementationError = function (report) {
        var status = false;
        if (report.report.error) {
            status = report.report.error.search('Step implementation missing for') > -1 ? true : false;
        }
        return status;
    };
    TestRails.prototype.loadTestRailRunData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRun(this.runId)];
                    case 1:
                        runInfo = _a.sent();
                        this.run = runInfo;
                        this.setTotalCasesInRun();
                        return [4 /*yield*/, this.getAllTestInRun()];
                    case 2:
                        _a.sent();
                        this.createCasetestIDMap(this.buckect);
                        return [2 /*return*/];
                }
            });
        });
    };
    TestRails.prototype.getAllTestInRun = function (params) {
        var _this = this;
        if (params === void 0) { params = ""; }
        return this.getTests(this.runId, params).then(function (rsp) {
            _this.buckect = (_this.buckect || []).concat(rsp.tests);
            if (rsp._links.next) {
                var params_1 = rsp._links.next.replace("/api/v2/get_tests/" + _this.runId, "");
                _this.getAllTestInRun(params_1);
            }
        });
    };
    TestRails.prototype.setTotalCasesInRun = function () {
        var passedCount = this.run.passed_count || 0;
        var retestCount = this.run.retest_count || 0;
        var untestedCount = this.run.untested_count || 0;
        var failedCount = this.run.failed_count || 0;
        var blockedCount = this.run.blocked_count || 0;
        this.totalCasesInRun =
            passedCount + retestCount + untestedCount + failedCount + blockedCount;
    };
    TestRails.prototype.createCasetestIDMap = function (tests) {
        var _this = this;
        (tests || []).forEach(function (test) {
            _this.caseTestMap[test.case_id] = test.id;
        });
    };
    TestRails.prototype.getReportFromTest = function (test) {
        var report;
        var caseIds = this.getCagIds(test.title || "");
        if (!caseIds) {
            return;
        }
        var _a = this.getTestIdsFromCaseId(caseIds), testIds = _a.testIds, missingCases = _a.missingCases;
        var ttagId = caseIds[0];
        if (ttagId) {
            var tagId = Number(ttagId);
            if (tagId) {
                // match user from e1-e5 and i1-i4
                var userInfo = "";
                try {
                    userInfo = (test.title || "").match(/(e(?:[1-5]))|(i(?:[1-4])\s)+/gim)[0];
                }
                catch (e) {
                    // nothing to do
                }
                var defaultcomment = test.title + " - " + test.state;
                var errorMsg = test && test.err && test.err.message;
                report = {
                    tagId: tagId,
                    caseIds: caseIds,
                    testIds: testIds,
                    missingCases: missingCases,
                    report: {
                        error: (errorMsg || ""),
                        comment: test.comment || defaultcomment,
                        "status_id": TestRailsInterfaces_1.TestRailStatusIds[test.state],
                        "custom_resultsvideo": TestRails.customVideoResult,
                        "custom_userinformation": userInfo,
                        elapsed: test.duration,
                    },
                };
            }
        }
        return report;
    };
    TestRails.prototype.getTestIdsFromCaseId = function (caseIds) {
        var _this = this;
        var testIds = [];
        var missingCases = [];
        caseIds.forEach(function (c) {
            var match = _this.caseTestMap[c];
            if (!match) {
                missingCases.push(c);
            }
            else {
                testIds.push(match);
            }
            return _this.caseTestMap[c];
        });
        return { testIds: testIds, missingCases: missingCases };
    };
    TestRails.prototype.getCagIds = function (title) {
        // Only matching case ids
        var result;
        try {
            // @TODO add a range to the regex if needed ([C][0-9]{2,8}+)
            var match = title.match(/([C][0-9]+)/gim) || [];
            result = match.map(function (id) { return Number(id.replace(/\w/, "")); });
        }
        catch (e) {
            //
        }
        return result;
    };
    TestRails.prototype.getSteps = function () {
        var stepResults = this.reports.map(function (report) {
            return {
                content: report.comment,
                actual: "Expected Result " + report.status_id,
                expected: "Expected Result " + TestRailsInterfaces_1.TestRailStatusIds.passed,
                "status_id": report.status_id,
            };
        });
        return stepResults;
    };
    TestRails.prototype.getStepsComment = function () {
        var stepResults = this.reports.map(function (report) { return report.comment; });
        return stepResults.join("\n");
    };
    TestRails.prototype.__call = function (requestConfg) {
        return new Promise(function (resolve, reject) {
            console.log(chalk_1.default.gray(requestConfg.url));
            axios_1.default({
                method: requestConfg.method,
                url: requestConfg.url,
                headers: { 'Content-Type': 'application/json' },
                auth: {
                    username: requestConfg.auth.username,
                    password: requestConfg.auth.password,
                },
                data: requestConfg.body
            })
                .then(function (response) {
                console.log(chalk_1.default.green('--- Sucess'));
                resolve(response.data);
            })
                .catch(function (error) {
                console.log(chalk_1.default.red('--- Fail'));
                reject(error);
            });
        });
    };
    TestRails.customVideoResult = "";
    return TestRails;
}());
exports.TestRails = TestRails;
//# sourceMappingURL=TestRail.js.map