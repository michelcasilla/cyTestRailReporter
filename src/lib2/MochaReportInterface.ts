import { ascendUnknown } from "./TestRailsInterfaces";

export interface Stats {
	suites: number;
	tests: number;
	passes: number;
	pending: number;
	failures: number;
	start: Date;
	end: Date;
	duration: number;
	testsRegistered: number;
	passPercent: number;
	pendingPercent: number;
	other: number;
	hasOther: boolean;
	skipped: number;
	hasSkipped: boolean;
}

export interface Err {
	message: string;
	estack: string;
	diff?: ascendUnknown;
}

export interface Test {
	title: string;
	fullTitle: string;
	timedOut?: ascendUnknown;
	duration: number;
	state: string;
	speed: string;
	pass: boolean;
	fail: boolean;
	pending: boolean;
	context?: ascendUnknown;
	code: string;
	err: Err;
	uuid: string;
	parentUUID: string;
	isHook: boolean;
	skipped: boolean;
}

export interface Suite {
	uuid: string;
	title: string;
	fullFile: string;
	file: string;
	beforeHooks: ascendUnknown[];
	afterHooks: ascendUnknown[];
	tests: Test[];
	suites: ascendUnknown[];
	passes: string[];
	failures: string[];
	pending: ascendUnknown[];
	skipped: ascendUnknown[];
	duration: number;
	root: boolean;
	rootEmpty: boolean;
	_timeout: number;
}

export interface Result {
	uuid: string;
	title: string;
	fullFile: string;
	file: string;
	beforeHooks: ascendUnknown[];
	afterHooks: ascendUnknown[];
	tests: ascendUnknown[];
	suites: Suite[];
	passes: ascendUnknown[];
	failures: ascendUnknown[];
	pending: ascendUnknown[];
	skipped: ascendUnknown[];
	duration: number;
	root: boolean;
	rootEmpty: boolean;
	_timeout: number;
}

export interface Mocha {
	version: string;
}

export interface Options {
	quiet: boolean;
	reportFilename: string;
	saveHtml: boolean;
	saveJson: boolean;
	consoleReporter: string;
	useInlineDiffs: boolean;
	code: boolean;
}

export interface Mochawesome {
	options: Options;
	version: string;
}

export interface Options2 {
	reportDir: string;
	overwrite: boolean;
	html: boolean;
	json: boolean;
}

export interface Marge {
	options: Options2;
	version: string;
}

export interface Meta {
	mocha: Mocha;
	mochawesome: Mochawesome;
	marge: Marge;
}

export interface MochaReportIterface {
	stats: Stats;
	results: Result[];
	meta: Meta;
}



export interface GetRunResponse {
  assignedto_id: number;
  blocked_count: number;
  completed_on?: any;
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
  description?: any;
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
  updated_on?: any;
  url: string;
}

export interface ReporterOptionsInterface {
	username: string;
	password: string;
	projectId: number;
	host?: string;
	suiteId?: number;
	runId?: number;
	runName?: string;
}