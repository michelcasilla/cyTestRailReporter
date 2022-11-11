// import { MochaReportIterface } from "./MochaReportInterface";
// import { TestRails } from "./TestRail";
// export const getTestRailRunIDFromEnv = (): number => {
//   const testrailRunId = Cypress.env("testrail_runId");
//   return testrailRunId;
// };
// export const haveRunID = (): boolean => {
//   return getTestRailRunIDFromEnv() ? true : false;
// };
// export const getTestRailCredentials = (): {
//   username: string;
//   password: string;
// } => {
//   // This most be called inside of cypress lifecicle.
//   return {
//     username: Cypress.env("testrail_username"),
//     password: Cypress.env("testrail_password"),
//   };
// };
// export const getTestRailHost = (): string => {
//   // this most be executes on a cypress live cicle.
//   return Cypress.env("testrail_host");
// };
// export const reportAllFromAReportFile = (): void => {
//   before(() => {
//     const TestRailsService = new TestRails(
//       getTestRailCredentials(),
//       getTestRailRunIDFromEnv(),
//       getTestRailHost()
//     );
//     cy.task("fileExist", "mochawesome-report/reports/mochawesome.json").then(
//       (content: string) => {
//         if (!content.trim()) {
//           return;
//         }
//         const parsedContent: MochaReportIterface = JSON.parse(content);
//         const all = parsedContent && parsedContent.results || [];
//         Cypress._.times(all.length, (index) => {
//           const feature = all[index];
//           (feature.suites || []).forEach((suits) => {
//             const allFeatureTest = suits.tests || [];
//             cy.wrap(allFeatureTest, { log: false }).each(() => {
//               TestRailsService.reports = [];
//               TestRailsService.tagIds = [];
//               TestRailsService.missingCases = [];
//               const currentTest = allFeatureTest.pop();
//               const _test = {
//                 ...currentTest,
//                 ...{ parent: { testsQueue: allFeatureTest } },
//               };
//               TestRailsService.reportFeatureResult(_test);
//             });
//           });
//         });
//       }
//     );
//   });
// };
// export const initTestRailReporter = (): void => {
//   let TestRailsService;
//   before(() => {
//     if (haveRunID()) {
//       TestRailsService = new TestRails(
//         getTestRailCredentials(),
//         getTestRailRunIDFromEnv(),
//         getTestRailHost()
//       );
//     }
//   });
//   Cypress.on("test:after:run", (testConfig, test) => {
//     if (haveRunID()) {
//       TestRailsService.collect(test);
//     }
//   });
//   after(() => {
//     if (haveRunID()) {
//       TestRailsService.report();
//     }
//   });
// };
//# sourceMappingURL=TestRailCyCommand.js.map