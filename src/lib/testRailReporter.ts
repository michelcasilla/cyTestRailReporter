import { IRunner, reporters } from 'mocha';
import moment = require('moment');
import { titleToCaseIds } from '../lib/shared';
import { TestRails } from './TestRail';
import { TestRailResult, Status } from '../lib/testrail.interface';
import { AddRunPayload } from './TestRailsInterfaces';
import { ReporterOptionsInterface } from './MochaReportInterface';

const chalk = require('chalk');

export class TestRailReporter extends reporters.Spec {
  private testRail: TestRails;
  private reporterOptions!: ReporterOptionsInterface;

  constructor(runner: any, options: any) {
    super(runner);

    this.reporterOptions = options.reporterOptions;
    const cred = {
      password: this.reporterOptions.password,
      username: this.reporterOptions.username,
    };

    this.testRail = new TestRails(cred, this.reporterOptions.runId, this.reporterOptions.host);
    console.log(runner.on);
    runner.on('start', async () => this.onStart());

    runner.on('pass', (test) => this.testRail.collect(test));

    runner.on('fail', (test) => this.testRail.collect(test));

    runner.on('end', () => this.testRail.report());

    runner.on('after:screenshot', () => this.testRail.report());

  }

  private onStart() {
	  const executionDateTime = moment().format('MMM Do YYYY, HH:mm (Z)');
      const name = `${
        this.reporterOptions.runName || 'AutomatedTest '
      } ${executionDateTime}`;

      const runconfig: AddRunPayload = {
        include_all: true,
        name,
        suite_id: this.reporterOptions.suiteId,
      };
      this.testRail.addRun(this.reporterOptions.projectId, runconfig);
    }
}
