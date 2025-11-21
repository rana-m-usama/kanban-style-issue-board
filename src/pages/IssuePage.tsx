import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Issue } from '../types';
import { IssueStatus } from '../types';
import { api } from '../utils/api';
import { useIssueStore } from '../store/issueStore';
import { useToastStore } from '../store/toastStore';
import { useRecentlyAccessed } from '../hooks/useRecentlyAccessed';
import { currentUser } from '../constants/currentUser';
import { canResolveIssues } from '../utils/permissions';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { calculatePriority } from '../utils/priorityCalculator';
import { getSeverityLabel } from '../utils/severityLabels';
import { getSeverityVariant, getStatusVariant } from '../utils/badgeVariants';
import styles from './IssuePage.module.scss';

export const IssuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateIssue } = useIssueStore();
  const { addToast } = useToastStore();
  const { addRecentIssue } = useRecentlyAccessed();
  
  const canResolve = canResolveIssues(currentUser);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await api.getIssueById(id);
        setIssue(data);
        if (data) {
          addRecentIssue(data.id);
        }
      } catch (error) {
        addToast('Failed to load issue', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssue();
  }, [id, addRecentIssue, addToast]);

  const handleMarkAsResolved = async () => {
    if (!issue || !canResolve) return;

    try {
      await updateIssue(issue.id, { status: IssueStatus.DONE });
      setIssue({ ...issue, status: IssueStatus.DONE });
      addToast('Issue marked as resolved', 'success');
    } catch (error) {
      addToast('Failed to mark issue as resolved', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.issuePage}>
        <div className={styles.loading}>Loading issue...</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className={styles.issuePage}>
        <div className={styles.error}>Issue not found</div>
        <Button onClick={() => navigate('/')}>Back to Board</Button>
      </div>
    );
  }

  const priority = calculatePriority(issue);

  return (
    <div className={styles.issuePage}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => navigate('/')}>
          ← Back to Board
        </Button>
      </div>

      <div className={styles.content}>
          <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{issue.title}</h1>
            <span className={styles.issueId}>{issue.id}</span>
          </div>
          <div className={styles.meta}>
            <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
            <Badge variant={getSeverityVariant(issue.severity)}>{getSeverityLabel(issue.severity)}</Badge>
            <span className={styles.priority}>Priority: {priority}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.description}>{issue.description}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Assignee:</span>
              <span className={styles.detailValue}>👤 {issue.assignee}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Created:</span>
              <span className={styles.detailValue}>
                {new Date(issue.createdAt).toLocaleString()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Updated:</span>
              <span className={styles.detailValue}>
                {new Date(issue.updatedAt).toLocaleString()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>User Defined Rank:</span>
              <span className={styles.detailValue}>{issue.userDefinedRank}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tags</h2>
          <div className={styles.tags}>
            {issue.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {canResolve && issue.status !== IssueStatus.DONE && (
          <div className={styles.actions}>
            <Button variant="primary" onClick={handleMarkAsResolved}>
              Mark as Resolved
            </Button>
          </div>
        )}

        {!canResolve && (
          <div className={styles.notice}>
            You don't have permission to modify this issue
          </div>
        )}
      </div>
    </div>
  );
};
