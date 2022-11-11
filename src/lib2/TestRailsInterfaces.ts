export type ascendUnknown = any
export interface TestRailConfig {
  method: string;
  url?: string;
  headers: TestRailConfigHeaders;
  auth: TestRailConfigAuth;
  q?: ascendUnknown;
  body?: ascendUnknown;
  log?: boolean;
}

export interface TestRailConfigAuth {
  username: string;
  password: string;
}

export interface TestRailConfigHeaders {
  "Content-Type": string;
}

export interface TestRailAddResult {
  status_id: number;
  comment: string;
  elapsed?: string;
  defects?: string;
  version?: string;
  custom_resultsvideo: string;
  custom_userinformation?: string;
  custom_stepresult?: string;
  custom_client?: string;
  custom_step_results?: TestRailCustomstepResult[];
  error?: string;
}

export interface TestRailCustomstepResult {
  content: string;
  expected: string;
  actual: string;
  status_id: number;
}

export enum TestRailStatusIds {
  passed = 1,
  blocked = 2,
  untested = 3,
  retest = 4,
  failed = 5,
}

export interface TestCaseMap {
  caseID: number;
  testID: number;
}

export interface CollectableReport {
  tagId: number;
  caseIds: number[];
  testIds: number[];
  report: TestRailAddResult;
  missingCases?: number[];
}

export interface AddRunPayload {
  suite_id: number;
  name: string;
  assignedto_id?: number;
  refs?: string;
  include_all: boolean;
  case_ids?: number[];
}

export interface UpdateRunPayload {
  description?: string;
  include_all?: boolean;
  case_ids?: number[] | string[];
}

export interface DeleteRunPayload {
  soft: boolean;
}

export interface GetRunResponse {
  assignedto_id: number;
  blocked_count: number;
  completed_on?: string;
  config: string;
  config_ids: number[];
  created_by: number;
  created_on: number;
  refs: string;
  custom_status1_count: number;
  custom_status2_count: number;
  custom_status3_count: number;
  custom_status4_count: number;
  custom_status5_count: number;
  custom_status6_count: number;
  custom_status7_count: number;
  description?: string;
  failed_count: number;
  id: number;
  include_all: boolean;
  is_completed: boolean;
  milestone_id: number;
  name: string;
  passed_count: number;
  plan_id: number;
  project_id: number;
  retest_count: number;
  suite_id: number;
  untested_count: number;
  updated_on?: number;
  url: string;
}

export interface GetTestResponse {
  offset: number;
  limit: number;
  size: number;
  _links: Links;
  tests: Test[];
}

export interface Test {
  id: number;
  case_id: number;
  status_id: number;
  assignedto_id?: number;
  run_id: number;
  title: string;
  template_id: number;
  type_id: number;
  priority_id: number;
  estimate?: string;
  estimate_forecast: string;
  refs?: string;
  milestone_id?: number;
  custom_automation_type: number;
  custom_expectedbehaviorvideo?: string;
  custom_e_one?: string;
  custom_e_two?: string;
  custom_e_three?: string;
  custom_e_four?: string;
  custom_e_five?: string;
  custom_i_one?: string;
  custom_i_two?: string;
  custom_i_three?: string;
  custom_i_four?: string;
  custom_casestatus?: string;
  custom_preconds?: string;
  custom_steps?: string;
  custom_expected?: string;
  custom_steps_separated?: string;
  custom_mission?: string;
  custom_goals?: string;
  custom_user_story?: string;
  sections_display_order: number;
  cases_display_order: number;
  case_comments: string[];
}

export interface Links {
  next: string;
  prev?: string;
}
