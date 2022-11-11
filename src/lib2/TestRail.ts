import axios, { Method } from "axios";
import axiosFormData from 'axios-form-data';
import chalk from "chalk";
import { auth } from "firebase-admin";
import { exit } from "process";
const FormData = require('form-data');
const fs = require('fs/promises');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
import {
  AddRunPayload,
  ascendUnknown,
  CollectableReport,
  DeleteRunPayload,
  GetRunResponse,
  GetTestResponse,
  Test,
  TestRailAddResult,
  TestRailConfig,
  TestRailConfigAuth,
  TestRailCustomstepResult,
  TestRailStatusIds,
  UpdateRunPayload,
} from "./TestRailsInterfaces";

export class TestRails {
  private host!: string;
  private static customVideoResult = "";
  private conf!: TestRailConfig;
  currentTagID: number;
  tagIds: number[] = [];
  missingCases: number[] = [];
  reports: TestRailAddResult[] = [];
  caseTestMap = {};
  cases: string[] | number[];
  runId: number;
  projectId: number;
  run!: GetRunResponse;
  totalCasesInRun: number;
  buckect: Test[];
  log = [];

  constructor(auth: TestRailConfigAuth, runId: number, host: string) {
    this.host = `${host}/index.php?/api/v2`;
    this.conf = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      auth: auth,
      log: true
    };
    this.buckect = [];
    if(runId){
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
  getRun(runId: number): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "GET";
    requestConfg.url = `${this.host}/get_run/${runId}`;
    return this.__call(requestConfg);
  }

  /**
   *
   * @param projectId the projectid to be used
   * @returns Chainable
   * @describe Returns a list of test runs for a project. Only returns those test runs that are not part of a test plan (please see get_plans/get_plan for this).
   */
  getRuns(projectId: number): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "GET";
    requestConfg.url = `${this.host}/get_runs/${projectId}`;
    return this.__call(requestConfg);
  }

  /**
   *
   * @param projectId The projectId
   * @param payload AddRunPayload instance
   * @returns Chainable
   * @describe Creates a new test run.
   */
  async addRun(projectId: number, payload: AddRunPayload): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/add_run/${projectId}`;
    requestConfg.body = payload;
    const response: any = await this.__call(requestConfg);
    this.runId = response.id;
    this.run = response;
    await this.loadTestRailRunData();
    return response;
    // set the runId after the response
  }

  /**
   *
   * @param runId The runID
   * @param payload And instance of UpdateRunPayload
   * @returns Chainable
   * @describe Updates an existing test run (partial updates are supported, i.e. you can submit and update specific fields only).
   * in you want to add more cases to the run.
   */
  updateRun(runId: number, payload: UpdateRunPayload): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/update_run/${runId}`;
    requestConfg.body = payload;
    return this.__call(requestConfg);
  }

  /**
   *
   * @param runId The runId
   * @returns Chainable
   * @describe Closes an existing test run and archives its tests & results.
   */
  closeRun(runId: number): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/close_run/${runId}`;
    return this.__call(requestConfg);
  }

  /**
   *
   * @param runId The run if to delete
   * @param payload Including soft=1 will not actually delete the entity.
   * @returns
   * @describe This action is permanent, it delets all the information related to the runID. can't be undone
   */
  deleteRun(runId: number, payload: DeleteRunPayload): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/delete_run/${runId}`;
    requestConfg.body = payload;
    return this.__call(requestConfg);
  }

  /**
   *
   * @param runId the runid to be used
   * @returns
   */
  getTests(runId: number, searchParams = ""): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "GET";
    requestConfg.url = `${this.host}/get_tests/${runId}${searchParams}`;
    return this.__call(requestConfg);
  }

  /**
   *
   * @param projectId the projectId
   * @param suiteId the suitId
   * @returns
   */
  getCases(projectId: number, suiteId?: number): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "GET";
    requestConfg.url = `${this.host}/get_cases/${projectId}`;
    if (suiteId) {
      requestConfg.url = requestConfg.url + `&suite_id=${suiteId}`;
    }
    return this.__call(requestConfg).then((rsp: { cases: any[] }) => {
      this.cases = rsp.cases;
    });
  }

  /**
   *
   * @param caseId the caseId
   * @returns
   * @description get information about and specific case
   */
  getCase(caseId: number): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "GET";
    requestConfg.url = `${this.host}/get_case/${caseId}`;
    return this.__call(requestConfg);
  }

  getCaseStatuses(): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "GET";
    requestConfg.url = `${this.host}/get_case_statuses`;
    return this.__call(requestConfg);
  }

  addResultForCase(
    runId: number,
    caseId: number,
    result: TestRailAddResult
  ): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/add_result_for_case/${runId}/${caseId}`;
    requestConfg.body = result;
    return this.__call(requestConfg);
  }

  addResult(testId: number, result: TestRailAddResult): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/add_result/${testId}`;
    requestConfg.body = result;
    return this.__call(requestConfg)
  }
  
  async addAttachmentResult(testId: number, file: string): Promise<any> {
  
    axios.interceptors.request.use(axiosFormData);
    const requestConfg = { ...this.conf };
    // Read image from disk as a Buffer
    file = '/Users/michel.casilla/Documents/MCT/A-SCENDTestRailReporter/cypress/videos/todo.cy.js.mp4';
    const image = await fs.readFile(file);
    const name = file.split('/').slice(-1);

    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('attachment', image, name);
    
    return axios.post(`${this.host}/add_attachment_to_result/${testId}`, form, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
      auth: this.conf.auth
    } ).then((response) => {
      console.log(chalk.green(JSON.stringify(response)));
    }).catch((error) => {
      console.error(error);
    });
  }

  updateTestIdStatus(
    testId: number,
    status: TestRailStatusIds,
    comment: string,
    customVideoResult = TestRails.customVideoResult
  ): Promise<any> {
    const requestConfg = { ...this.conf };
    requestConfg.method = "POST";
    requestConfg.url = `${this.host}/add_result/${testId}`;
    const data: TestRailAddResult = {
      "status_id": status,
      comment: comment,
      "custom_resultsvideo": customVideoResult,
      "custom_userinformation": "e1",
    };
    requestConfg.body = data;
    return this.__call(requestConfg);
  }

  reportTestResult(test: any): void {
    const report = this.getReportFromTest(test);
    if (report) {
      this.addResult(report.tagId, report.report);
    }
  }

  reportFeatureResult(test: any, sendResultForEachUser = false): void {
    const parent = test.parent as any;
    const testsQueue = parent.testsQueue;
    this.collect(test);
    if (testsQueue.length) {
      if (sendResultForEachUser) {
        this.reportTestResult(test);
      }
    } else {
      this.report()
    }
  }
  
  async report(): Promise<void> {
    if(this.missingCases.length){
        const keys = Object.keys(this.caseTestMap).map(x => Number(x));
        const payload: UpdateRunPayload = {
          "case_ids": this.missingCases.concat(keys),
          'include_all': false
        }
        await this.updateRun(this.runId, payload)
        await this.loadTestRailRunData()
        const {testIds} = this.getTestIdsFromCaseId(this.missingCases);
        // this.tagIds = Cypress._.uniq((this.tagIds || []).concat(testIds));
        this.tagIds = (this.tagIds || []).concat(testIds);
        // resolve(true)
        await this.reportCollected();
    }else{
      await this.reportCollected();
    }
  }
  

  async reportCollected(): Promise<void> {
    
    const fail = this.reports.some(
      (report) => report.status_id !== TestRailStatusIds.passed
    );
    const totalS = this.getReportElapsedTime(); // `${totalTime / 1000}S`;
    const status = fail ? TestRailStatusIds.failed : TestRailStatusIds.passed;
    const stepResults = this.getSteps();
    const comment = this.getStepsComment();
    const report: TestRailAddResult = {
      "status_id": status,
      comment: comment,
      elapsed: totalS,
      "custom_step_results": stepResults,
      "custom_resultsvideo": TestRails.customVideoResult,
    };
    for (const tagId of this.tagIds) {
      await this.addResult(tagId, report);
      await this.addAttachmentResult(tagId, '/fixtures/todo.cy.js.mp4');
    }
  }

  private getReportElapsedTime(): string{
    
    const millis = this.reports.reduce((acc, report) => {
      return (acc += Number(report.elapsed));
    }, 0);

    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000);
    return (minutes+seconds > 0) ? `${minutes}M ${seconds.toFixed(0)}S` : `1S`;

  }

  collect(test: any): void {
    const report = this.getReportFromTest(test);
    if (report) {
      this.currentTagID = report.tagId;
      this.tagIds = report.testIds || [];
      this.missingCases = report.missingCases;
      if(!this.isPendingImplementationError(report)){
        this.reports.push(report.report);
      }
    }
  }

  private isPendingImplementationError(report: CollectableReport): boolean{
    let status = false;
    if(report.report.error){
      status = report.report.error.search('Step implementation missing for') > -1 ? true : false;
    }
    return status;
  }

  private async loadTestRailRunData(): Promise<any> {
    const runInfo = await this.getRun(this.runId)
      this.run = runInfo;
      this.setTotalCasesInRun();
      await this.getAllTestInRun()
      this.createCasetestIDMap(this.buckect);
  }

  private getAllTestInRun(params = ""): Promise<any> {
    return this.getTests(this.runId, params).then((rsp: GetTestResponse) => {
      this.buckect = (this.buckect || []).concat(rsp.tests);
      if (rsp._links.next) {
        const params = rsp._links.next.replace(
          `/api/v2/get_tests/${this.runId}`,
          ""
        );
        this.getAllTestInRun(params);
      }
    });
  }

  private setTotalCasesInRun(): void {
    const passedCount = this.run.passed_count || 0;
    const retestCount = this.run.retest_count || 0;
    const untestedCount = this.run.untested_count || 0;
    const failedCount = this.run.failed_count || 0;
    const blockedCount = this.run.blocked_count || 0;
    this.totalCasesInRun =
      passedCount + retestCount + untestedCount + failedCount + blockedCount;
  }

  private createCasetestIDMap(tests: { case_id: number; id: number }[]): void {
    (tests || []).forEach((test) => {
      this.caseTestMap[test.case_id] = test.id;
    });
  }

  private getReportFromTest(test: any): CollectableReport | null {
    let report: CollectableReport | null;

    const caseIds = this.getCagIds(test.title || "");
    if(!caseIds){ return; }
    const {testIds, missingCases} = this.getTestIdsFromCaseId(caseIds);
    
    const ttagId = caseIds[0];
    if (ttagId) {
      const tagId = Number(ttagId);
      if(tagId){
        // match user from e1-e5 and i1-i4
        let userInfo = "";
        try{
          userInfo = (test.title || "").match(/(e(?:[1-5]))|(i(?:[1-4])\s)+/gim)[0];
        }catch(e){
          // nothing to do
        }
        const defaultcomment = `${test.title} - ${test.state}`;
        const errorMsg = test && test.err && test.err.message;
        report = {
          tagId: tagId,
          caseIds: caseIds,
          testIds: testIds,
          missingCases: missingCases,
          report: {
            error: (errorMsg || ""),
            comment: test.comment || defaultcomment,
            "status_id": TestRailStatusIds[test.state] as ascendUnknown as number,
            "custom_resultsvideo": TestRails.customVideoResult,
            "custom_userinformation": userInfo,
            elapsed: test.duration,
          },
        };
      }
    }
    return report;
  }


  private getTestIdsFromCaseId(caseIds: number[]): {testIds: number[]; missingCases: number[]} {
    const testIds = [];
    const missingCases = [];
    caseIds.forEach((c) => {
      const match = this.caseTestMap[c];
      if(!match){ missingCases.push(c); }
      else{ testIds.push(match)  }
      return this.caseTestMap[c];
    });
    return {testIds, missingCases};
  }

  private getCagIds(title: string): number[] {
    // Only matching case ids
    let result: number[];
    try{
      // @TODO add a range to the regex if needed ([C][0-9]{2,8}+)
      const match = title.match(/([C][0-9]+)/gim) || [];
      result = match.map((id) => Number(id.replace(/\w/, "")));
    }catch(e){ 
      //
    }
      return result;
  }

  private getSteps(): TestRailCustomstepResult[] {
    const stepResults: TestRailCustomstepResult[] = this.reports.map(
      (report) => {
        return {
          content: report.comment,
          actual: `Expected Result ${report.status_id}`,
          expected: `Expected Result ${TestRailStatusIds.passed}`,
          "status_id": report.status_id,
        };
      }
    );
    return stepResults;
  }

  private getStepsComment(): string {
    const stepResults: string[] = this.reports.map((report) => report.comment);
    return stepResults.join("\n");
  }

  private __call<T>(requestConfg: TestRailConfig): Promise<T> {
    return new Promise((resolve, reject)=>{
      axios({
        method: requestConfg.method as Method,
        url: requestConfg.url,
        headers: { 'Content-Type': 'application/json' },
        auth: {
          username: requestConfg.auth.username,
          password: requestConfg.auth.password,
        },
        data: requestConfg.body
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }
}
