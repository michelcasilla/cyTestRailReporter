'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
var mocha_1 = require('mocha');
var moment = require('moment');
var testrail_1 = require('./testrail');
var shared_1 = require('./shared');
var testrail_interface_1 = require('./testrail.interface');
var chalk = require('chalk');
var CypTrReporter = /** @class */ (function (_super) {
  __extends(CypTrReporter, _super);
  function CypTrReporter(runner, options) {
    var _this = _super.call(this, runner) || this;
    _this.results = [];
    var reporterOptions = options.reporterOptions;
    if (process.env.CY_TR_REPORTER_PASSWORD) {
      reporterOptions.password = process.env.CY_TR_REPORTER_PASSWORD;
    }
    _this.testRail = new testrail_1.TestRail(reporterOptions);
    _this.validate(reporterOptions, 'host');
    _this.validate(reporterOptions, 'username');
    _this.validate(reporterOptions, 'password');
    _this.validate(reporterOptions, 'projectId');
    _this.validate(reporterOptions, 'suiteId');
    runner.on('start', function () {
      var executionDateTime = moment().format('MMM Do YYYY, HH:mm (Z)');
      var name =
        (reporterOptions.runName || 'Automated test run') +
        ' ' +
        executionDateTime;
      var description =
        'For the Cypress run visit https://dashboard.cypress.io/#/projects/runs';
      _this.testRail.createRun(name, description);
    });
    runner.on('pass', function (test) {
      var caseIds = shared_1.titleToCaseIds(test.title);
      if (caseIds.length > 0) {
        var results = caseIds.map(function (caseId) {
          return {
            case_id: caseId,
            status_id: testrail_interface_1.Status.Passed,
            comment: 'Execution time: ' + test.duration + 'ms',
            elapsed: test.duration / 1000 + 's',
          };
        });
        (_a = _this.results).push.apply(_a, results);
      }
      var _a;
    });
    runner.on('fail', function (test) {
      var caseIds = shared_1.titleToCaseIds(test.title);
      if (caseIds.length > 0) {
        var results = caseIds.map(function (caseId) {
          return {
            case_id: caseId,
            status_id: testrail_interface_1.Status.Failed,
            comment: '' + test.err.message,
          };
        });
        (_a = _this.results).push.apply(_a, results);
      }
      var _a;
    });
    runner.on('end', function () {
      if (_this.results.length == 0) {
        console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
        console.warn(
          '\n',
          'No testcases were matched. Ensure that your tests are declared correctly and matches Cxxx',
          '\n'
        );
        _this.testRail.deleteRun();
        return;
      }
      // publish test cases results & close the run
      _this.testRail.publishResults(_this.results).then(function () {
        return _this.testRail.closeRun();
      });
    });
    return _this;
  }
  CypTrReporter.prototype.validate = function (options, name) {
    if (options == null) {
      throw new Error('Missing reporterOptions in cypress.json');
    }
    if (options[name] == null) {
      throw new Error(
        'Missing ' +
          name +
          ' value. Please update reporterOptions in cypress.json'
      );
    }
  };
  return CypTrReporter;
})(mocha_1.reporters.Spec);
exports.CypTrReporter = CypTrReporter;
//# sourceMappingURL=cy-tr-reporter.js.map
