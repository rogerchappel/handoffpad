export type HandoffCommandStatus = "pass" | "fail" | "unknown";

export interface HandoffCommand {
  command: string;
  status: HandoffCommandStatus;
  summary: string;
}

export interface HandoffFileChange {
  path: string;
  status: string;
  additions?: number;
  deletions?: number;
}

export interface HandoffBundle {
  schemaVersion: "handoffpad.v1";
  createdAt: string;
  task: {
    source: string;
    summary: string;
  };
  git: {
    root: string;
    since: string;
    head: string;
    branch: string;
    changedFiles: HandoffFileChange[];
    diff?: string;
  };
  commands: HandoffCommand[];
  notes: string[];
  omissions: string[];
  nextSteps: string[];
  redactions: string[];
}

export interface CreateOptions {
  task: string;
  since: string;
  output: string;
  cwd: string;
  commandLog?: string;
  includeDiff: boolean;
  note: string[];
  nextStep: string[];
  omission: string[];
}

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}
