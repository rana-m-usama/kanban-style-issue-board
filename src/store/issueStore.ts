import { create } from 'zustand';
import type { Issue, FilterOptions } from '../types';
import { api } from '../utils/api';
import { sortIssuesByPriority } from '../utils/priorityCalculator';

interface IssueState {
  issues: Issue[];
  filteredIssues: Issue[];
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  
  // Actions
  fetchIssues: () => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  updateIssueOptimistic: (id: string, updates: Partial<Issue>) => void;
  revertIssue: (issue: Issue) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  applyFilters: () => void;
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  filteredIssues: [],
  filters: {
    searchQuery: '',
    assignee: null,
    severity: null
  },
  isLoading: false,
  error: null,
  lastSyncTime: null,

  fetchIssues: async () => {
    set({ isLoading: true, error: null });
    try {
      const issues = await api.getIssues();
      set({ 
        issues, 
        isLoading: false,
        lastSyncTime: new Date()
      });
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch issues',
        isLoading: false 
      });
    }
  },

  updateIssue: async (id: string, updates: Partial<Issue>) => {
    try {
      const updatedIssue = await api.updateIssue(id, updates);
      set(state => ({
        issues: state.issues.map(issue => 
          issue.id === id ? updatedIssue : issue
        )
      }));
      get().applyFilters();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update issue'
      });
      throw error;
    }
  },

  updateIssueOptimistic: (id: string, updates: Partial<Issue>) => {
    set(state => ({
      issues: state.issues.map(issue =>
        issue.id === id ? { ...issue, ...updates, updatedAt: new Date().toISOString() } : issue
      )
    }));
    get().applyFilters();
  },

  revertIssue: (issue: Issue) => {
    set(state => ({
      issues: state.issues.map(i => i.id === issue.id ? issue : i)
    }));
    get().applyFilters();
  },

  setFilters: (newFilters: Partial<FilterOptions>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { issues, filters } = get();
    
    let filtered = [...issues];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply assignee filter
    if (filters.assignee) {
      filtered = filtered.filter(issue => issue.assignee === filters.assignee);
    }

    // Apply severity filter
    if (filters.severity !== null) {
      filtered = filtered.filter(issue => issue.severity === filters.severity);
    }

    // Sort by priority
    filtered = sortIssuesByPriority(filtered);

    set({ filteredIssues: filtered });
  }
}));
