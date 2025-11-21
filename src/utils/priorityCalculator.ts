import type { Issue } from '../types';

export const calculatePriority = (issue: Issue): number => {
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Priority formula: severity * 10 + (daysSinceCreated * -1) + userDefinedRank
  return issue.severity * 10 + daysSinceCreated * -1 + issue.userDefinedRank;
};

export const sortIssuesByPriority = (issues: Issue[]): Issue[] => {
  return [...issues].sort((a, b) => {
    const priorityA = calculatePriority(a);
    const priorityB = calculatePriority(b);
    
    // Higher priority first
    if (priorityB !== priorityA) {
      return priorityB - priorityA;
    }
    
    // If priorities match, newer issues appear first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
