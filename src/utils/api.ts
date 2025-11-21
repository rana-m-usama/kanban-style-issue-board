import type { Issue } from '../types';
import { IssueStatus } from '../types';
import issuesData from '../data/issues.json';

const DELAY_MS = 500;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getIssues(): Promise<Issue[]> {
    await delay(DELAY_MS);
    return issuesData as Issue[];
  },

  async getIssueById(id: string): Promise<Issue | null> {
    await delay(DELAY_MS);
    const issue = issuesData.find(issue => issue.id === id);
    return issue ? (issue as Issue) : null;
  },

  async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue> {
    await delay(DELAY_MS);
    const issue = issuesData.find(i => i.id === id);
    
    if (!issue) {
      throw new Error(`Issue ${id} not found`);
    }
    
    return {
      ...(issue as Issue),
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  async updateIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
    return this.updateIssue(id, { status });
  },

  async resolveIssue(id: string): Promise<Issue> {
    return this.updateIssueStatus(id, IssueStatus.DONE);
  }
};
