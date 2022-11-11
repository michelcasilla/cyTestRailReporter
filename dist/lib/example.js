// import moment = require('moment');
// import { TestRails } from './TestRail';
// import { AddRunPayload } from './TestRailsInterfaces';
// import { ReporterOptionsInterface } from './MochaReportInterface';
// const chalk = require('chalk');
// export class TestRailReporter{
//   private testRail: TestRails;
//   private reporterOptions!: ReporterOptionsInterface;
//   constructor(options: {reporterOptions: ReporterOptionsInterface}) {
//     this.reporterOptions = options.reporterOptions;
//     const cred = {
//       password: this.reporterOptions.password,
//       username: this.reporterOptions.username,
//     };
//     this.testRail = new TestRails(cred, this.reporterOptions.runId, this.reporterOptions.host);
//     this.onStart()
//     this.testRail.collect({title : "my test"});
//     this.testRail.collect({title : "Other test"});
//     this.testRail.report();
//     this.testRail.report();
//   }
//   private onStart() {
// 	const executionDateTime = moment().format('MMM Do YYYY, HH:mm (Z)');
//       const name = `${
//         this.reporterOptions.runName || 'AutomatedTest '
//       } ${executionDateTime}`;
//       const runconfig: AddRunPayload = {
//         include_all: false,
//         name,
//         suite_id: this.reporterOptions.suiteId,
//       };
//       this.testRail.addRun(this.reporterOptions.projectId, runconfig);
//   }
// }
// new TestRailReporter({
//   reporterOptions : {
//      host: "https://ascend2.testrail.io",
//     username: "Brandon.kelly@a-lign.com",
//     password: "XwjEW2ftQiks6ZnN6RUq-r6mOBM12Ku2aiOwlAcP7",
//     projectId: 3,
//     suiteId: 1,
//     runId: 0,
//     runName: 'AutomatedTest Report'
//   }
// });
//# sourceMappingURL=example.js.map