import React from 'react';
import { Link } from 'react-router-dom';
import { Board } from '../components/Board';
import { Badge } from '../components/common/Badge';
import { useRecentlyAccessed } from '../hooks/useRecentlyAccessed';
import { useIssueStore } from '../store/issueStore';
import { getSeverityLabel } from '../utils/severityLabels';
import { getStatusLabel } from '../utils/statusLabels';
import { getSeverityVariant, getStatusVariant } from '../utils/badgeVariants';
import styles from './BoardPage.module.scss';

export const BoardPage: React.FC = () => {
  const { recentIssues, clearRecentIssues } = useRecentlyAccessed();
  const { issues } = useIssueStore();

  const recentIssueData = recentIssues
    .map(id => issues.find(issue => issue.id === id))
    .filter(Boolean);

  return (
    <div className={styles.boardPage}>
      <div className={styles.main}>
        <Board />
      </div>
      
      {recentIssues.length > 0 && (
        <aside className={styles.sidebar}>
          <div className={styles.sidebar__header}>
            <h3 className={styles.sidebar__title}>Recently Accessed</h3>
            <button 
              className={styles.sidebar__clear}
              onClick={clearRecentIssues}
              aria-label="Delete recent issues"
            >
              Delete
            </button>
          </div>
          
          <ul className={styles.sidebar__list}>
            {recentIssueData.map(issue => {
              if (!issue) return null;
              
              return (
                <li key={issue.id} className={styles.sidebar__item}>
                  <Link to={`/issue/${issue.id}`} className={styles.sidebar__link}>
                    <div className={styles.sidebar__header}>
                      <span className={styles.sidebar__issueId}>{issue.id}</span>
                      <div className={styles.sidebar__badges}>
                        <Badge variant={getStatusVariant(issue.status)}>{getStatusLabel(issue.status)}</Badge>
                      </div>
                    </div>
                    <span className={styles.sidebar__issueTitle}>{issue.title}</span>
                    <div className={styles.sidebar__meta}>
                      <Badge variant={getSeverityVariant(issue.severity)}>{getSeverityLabel(issue.severity)}</Badge>
                      <span className={styles.sidebar__assignee}>👤 {issue.assignee}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </div>
  );
};
