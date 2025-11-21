import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MAX_RECENT_ITEMS = 5;

export function useRecentlyAccessed() {
  const [recentIssues, setRecentIssues] = useLocalStorage<string[]>('recentlyAccessedIssues', []);

  const addRecentIssue = useCallback((issueId: string) => {
    setRecentIssues(prev => {
      const filtered = prev.filter(id => id !== issueId);
      const updated = [issueId, ...filtered].slice(0, MAX_RECENT_ITEMS);
      return updated;
    });
  }, [setRecentIssues]);

  const clearRecentIssues = useCallback(() => {
    setRecentIssues([]);
  }, [setRecentIssues]);

  return {
    recentIssues,
    addRecentIssue,
    clearRecentIssues
  };
}
