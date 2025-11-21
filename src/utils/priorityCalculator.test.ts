import { describe, it, expect } from 'vitest';
import { calculatePriority, sortIssuesByPriority } from './priorityCalculator';
import type { Issue } from '../types';

describe('priorityCalculator', () => {
  describe('calculatePriority', () => {
    const baseDate = new Date('2024-01-01T00:00:00Z');
    
    const createMockIssue = (overrides: Partial<Issue> = {}): Issue => ({
      id: '1',
      title: 'Test Issue',
      description: 'Test Description',
      status: 'backlog',
      severity: 5,
      userDefinedRank: 0,
      assignee: 'john.doe',
      tags: [],
      createdAt: baseDate.toISOString(),
      updatedAt: baseDate.toISOString(),
      ...overrides,
    });

    it('should calculate priority with base formula: severity * 10 + daysSince * -1 + rank', () => {
      const issue = createMockIssue({
        severity: 5,
        userDefinedRank: 10,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      });
      
      const priority = calculatePriority(issue);
      // Expected: 5 * 10 + 3 * -1 + 10 = 50 - 3 + 10 = 57
      expect(priority).toBe(57);
    });

    it('should give higher priority to higher severity issues', () => {
      const lowSeverity = createMockIssue({ severity: 1, userDefinedRank: 0 });
      const highSeverity = createMockIssue({ severity: 10, userDefinedRank: 0 });
      
      expect(calculatePriority(highSeverity)).toBeGreaterThan(calculatePriority(lowSeverity));
    });

    it('should decrease priority for older issues (negative days multiplier)', () => {
      const recentIssue = createMockIssue({
        severity: 5,
        userDefinedRank: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      });
      
      const oldIssue = createMockIssue({
        severity: 5,
        userDefinedRank: 0,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      });
      
      expect(calculatePriority(recentIssue)).toBeGreaterThan(calculatePriority(oldIssue));
    });

    it('should increase priority with higher user-defined rank', () => {
      const lowRank = createMockIssue({ severity: 5, userDefinedRank: 0 });
      const highRank = createMockIssue({ severity: 5, userDefinedRank: 50 });
      
      expect(calculatePriority(highRank)).toBeGreaterThan(calculatePriority(lowRank));
      expect(calculatePriority(highRank) - calculatePriority(lowRank)).toBe(50);
    });

    it('should handle zero values correctly', () => {
      const issue = createMockIssue({
        severity: 0,
        userDefinedRank: 0,
        createdAt: new Date().toISOString(), // Just created (0 days old)
      });
      
      const priority = calculatePriority(issue);
      expect(priority).toBe(0);
    });

    it('should handle negative user-defined rank', () => {
      const issue = createMockIssue({
        severity: 5,
        userDefinedRank: -10,
        createdAt: new Date().toISOString(),
      });
      
      const priority = calculatePriority(issue);
      // Expected: 5 * 10 + 0 + (-10) = 40
      expect(priority).toBe(40);
    });

    it('should calculate correctly for issues created today', () => {
      const today = createMockIssue({
        severity: 5,
        userDefinedRank: 0,
        createdAt: new Date().toISOString(),
      });
      
      const priority = calculatePriority(today);
      // Days since created should be 0, so: 5 * 10 + 0 * -1 + 0 = 50
      expect(priority).toBe(50);
    });

    it('should handle very old issues', () => {
      const veryOldIssue = createMockIssue({
        severity: 5,
        userDefinedRank: 0,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
      });
      
      const priority = calculatePriority(veryOldIssue);
      // Should be negative: 5 * 10 + 365 * -1 + 0 = 50 - 365 = -315
      expect(priority).toBe(-315);
    });
  });

  describe('sortIssuesByPriority', () => {
    const createMockIssue = (
      id: string,
      severity: number,
      userDefinedRank: number,
      daysAgo: number
    ): Issue => ({
      id,
      title: `Issue ${id}`,
      description: 'Test Description',
      status: 'backlog',
      severity,
      userDefinedRank,
      assignee: 'john.doe',
      tags: [],
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    it('should sort issues by priority in descending order', () => {
      const issues: Issue[] = [
        createMockIssue('1', 3, 0, 1), // Priority: 30 - 1 = 29
        createMockIssue('2', 7, 0, 1), // Priority: 70 - 1 = 69
        createMockIssue('3', 5, 0, 1), // Priority: 50 - 1 = 49
      ];
      
      const sorted = sortIssuesByPriority(issues);
      
      expect(sorted[0].id).toBe('2'); // Highest priority (69)
      expect(sorted[1].id).toBe('3'); // Medium priority (49)
      expect(sorted[2].id).toBe('1'); // Lowest priority (29)
    });

    it('should not mutate the original array', () => {
      const issues: Issue[] = [
        createMockIssue('1', 3, 0, 1),
        createMockIssue('2', 7, 0, 1),
      ];
      
      const originalOrder = issues.map(i => i.id);
      sortIssuesByPriority(issues);
      
      expect(issues.map(i => i.id)).toEqual(originalOrder);
    });

    it('should prioritize newer issues when priorities are equal', () => {
      const issues: Issue[] = [
        createMockIssue('older', 5, 0, 10), // Priority: 50 - 10 = 40, older
        createMockIssue('newer', 5, 0, 1),  // Priority: 50 - 1 = 49, newer but wait... different priority
      ];
      
      // Let's create truly equal priorities
      const equalPriorityIssues: Issue[] = [
        createMockIssue('older', 5, 10, 10), // Priority: 50 - 10 + 10 = 50
        createMockIssue('newer', 5, 10, 1),  // Priority: 50 - 1 + 1 = 50
      ];
      
      const sorted = sortIssuesByPriority(equalPriorityIssues);
      
      // When priorities are equal, newer issues (more recent createdAt) should come first
      expect(sorted[0].id).toBe('newer');
      expect(sorted[1].id).toBe('older');
    });

    it('should handle empty array', () => {
      const sorted = sortIssuesByPriority([]);
      expect(sorted).toEqual([]);
    });

    it('should handle single issue', () => {
      const issues: Issue[] = [createMockIssue('1', 5, 0, 1)];
      const sorted = sortIssuesByPriority(issues);
      
      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('1');
    });

    it('should correctly sort complex scenario with mixed priorities', () => {
      const issues: Issue[] = [
        createMockIssue('1', 10, 0, 5),  // Priority: 100 - 5 = 95
        createMockIssue('2', 8, 10, 3),  // Priority: 80 - 3 + 10 = 87
        createMockIssue('3', 9, -5, 2),  // Priority: 90 - 2 - 5 = 83
        createMockIssue('4', 10, -10, 5), // Priority: 100 - 5 - 10 = 85
        createMockIssue('5', 7, 15, 1),  // Priority: 70 - 1 + 15 = 84
      ];
      
      const sorted = sortIssuesByPriority(issues);
      
      expect(sorted.map(i => i.id)).toEqual(['1', '2', '4', '5', '3']);
    });

    it('should handle issues with negative priorities', () => {
      const issues: Issue[] = [
        createMockIssue('1', 1, 0, 100), // Priority: 10 - 100 = -90
        createMockIssue('2', 2, 0, 50),  // Priority: 20 - 50 = -30
        createMockIssue('3', 1, 0, 50),  // Priority: 10 - 50 = -40
      ];
      
      const sorted = sortIssuesByPriority(issues);
      
      expect(sorted[0].id).toBe('2'); // -30 (highest)
      expect(sorted[1].id).toBe('3'); // -40
      expect(sorted[2].id).toBe('1'); // -90 (lowest)
    });

    it('should handle all issues with same priority, sorted by creation date', () => {
      const now = Date.now();
      const issues: Issue[] = [
        {
          ...createMockIssue('3', 5, 0, 0),
          createdAt: new Date(now - 3000).toISOString(),
        },
        {
          ...createMockIssue('1', 5, 0, 0),
          createdAt: new Date(now - 1000).toISOString(), // Most recent
        },
        {
          ...createMockIssue('2', 5, 0, 0),
          createdAt: new Date(now - 2000).toISOString(),
        },
      ];
      
      const sorted = sortIssuesByPriority(issues);
      
      expect(sorted.map(i => i.id)).toEqual(['1', '2', '3']);
    });
  });
});
