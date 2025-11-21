import React, { useEffect, useMemo } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Issue } from '../../types';
import { IssueStatus } from '../../types';
import { useIssueStore } from '../../store/issueStore';
import { useToastStore } from '../../store/toastStore';
import { currentUser } from '../../constants/currentUser';
import { canMoveIssues } from '../../utils/permissions';
import { usePolling } from '../../hooks/usePolling';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Column } from './Column';
import { IssueCard } from './IssueCard';
import { SEVERITY_OPTIONS } from '../../utils/severityLabels';
import { getStatusLabel } from '../../utils/statusLabels';
import styles from './Board.module.scss';

export const Board: React.FC = () => {
  const { issues, filteredIssues, filters, fetchIssues, updateIssue, updateIssueOptimistic, revertIssue, setFilters, lastSyncTime } = useIssueStore();
  const { addToast } = useToastStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [previousIssue, setPreviousIssue] = React.useState<Issue | null>(null);

  const canDrag = canMoveIssues(currentUser);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch issues on mount
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Polling for updates every 10 seconds
  usePolling(() => {
    fetchIssues();
  }, 10000);

  // Group issues by status
  const issuesByStatus = useMemo(() => {
    return {
      [IssueStatus.BACKLOG]: filteredIssues.filter(i => i.status === IssueStatus.BACKLOG),
      [IssueStatus.IN_PROGRESS]: filteredIssues.filter(i => i.status === IssueStatus.IN_PROGRESS),
      [IssueStatus.DONE]: filteredIssues.filter(i => i.status === IssueStatus.DONE),
    };
  }, [filteredIssues]);

  // Get unique assignees for filters from all issues (not just filtered ones)
  const assignees = useMemo(() => {
    const assigneeSet = new Set(issues.map(i => i.assignee));
    return Array.from(assigneeSet).sort();
  }, [issues]);

  const handleDragStart = (event: DragStartEvent) => {
    if (!canDrag) return;
    const { active } = event;
    setActiveId(active.id as string);
    
    // Store the previous state for undo
    const issue = filteredIssues.find(i => i.id === active.id);
    if (issue) {
      setPreviousIssue({ ...issue });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!canDrag) return;
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;
    const issue = filteredIssues.find(i => i.id === issueId);

    if (!issue || issue.status === newStatus) {
      setActiveId(null);
      return;
    }

    // Optimistically update the UI
    updateIssueOptimistic(issueId, { status: newStatus });

    const fromStatusLabel = previousIssue?.status ? getStatusLabel(previousIssue.status) : '';
    const toStatusLabel = getStatusLabel(newStatus);

    // Show toast with undo option
    const message = `${issue.id}: ${issue.title} moved ${fromStatusLabel ? `from ${fromStatusLabel} ` : ''}to ${toStatusLabel}`;

    addToast(
      message,
      'info',
      () => {
        if (previousIssue) {
          revertIssue(previousIssue);
          addToast(`${previousIssue.id}: ${previousIssue.title} restored to ${getStatusLabel(previousIssue.status)}`, 'success');
        }
      }
    );

    // Persist the change asynchronously
    updateIssue(issueId, { status: newStatus }).catch(() => {
      // If the API call fails, revert the optimistic update
      if (previousIssue) {
        revertIssue(previousIssue);
        addToast('Failed to update issue. Change reverted.', 'error');
      }
    });

    setActiveId(null);
    setPreviousIssue(null);
  };

  const activeIssue = activeId ? filteredIssues.find(i => i.id === activeId) : null;

  return (
    <div className={styles.board}>
      <div className={styles.board__header}>
        <h1 className={styles.board__title}>Issue Board</h1>
        {lastSyncTime && (
          <span className={styles.board__sync}>
            Last synced: {new Date(lastSyncTime).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className={styles.board__filters}>
        <Input
          type="text"
          placeholder="Search by title or tags..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          className={styles.board__search}
        />
        
        <Select
          options={[
            { value: '', label: 'All Assignees' },
            ...assignees.map(a => ({ value: a, label: a }))
          ]}
          value={filters.assignee || ''}
          onChange={(e) => setFilters({ assignee: e.target.value || null })}
        />
        
        <Select
          options={[
            { value: '', label: 'All Severities' },
            ...SEVERITY_OPTIONS.map(s => ({ value: String(s.value), label: s.label }))
          ]}
          value={filters.severity !== null ? String(filters.severity) : ''}
          onChange={(e) => setFilters({ severity: e.target.value ? Number(e.target.value) : null })}
        />
      </div>

      {!canDrag && (
        <div className={styles.board__notice}>
          Read-only mode: You don't have permission to move issues
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.board__columns}>
          <Column
            title="Backlog"
            status={IssueStatus.BACKLOG}
            issues={issuesByStatus[IssueStatus.BACKLOG]}
            canDrag={canDrag}
          />
          <Column
            title="In Progress"
            status={IssueStatus.IN_PROGRESS}
            issues={issuesByStatus[IssueStatus.IN_PROGRESS]}
            canDrag={canDrag}
          />
          <Column
            title="Done"
            status={IssueStatus.DONE}
            issues={issuesByStatus[IssueStatus.DONE]}
            canDrag={canDrag}
          />
        </div>

        <DragOverlay>
          {activeIssue ? <IssueCard issue={activeIssue} canDrag={canDrag} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
