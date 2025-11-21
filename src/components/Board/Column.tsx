import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Issue } from '../../types';
import { IssueStatus } from '../../types';
import { IssueCard } from './IssueCard';
import styles from './Column.module.scss';

interface ColumnProps {
  title: string;
  status: IssueStatus;
  issues: Issue[];
  canDrag: boolean;
}

export const Column: React.FC<ColumnProps> = ({ title, status, issues, canDrag }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className={styles.column}>
      <div className={styles.column__header}>
        <h2 className={styles.column__title}>{title}</h2>
        <span className={styles.column__count}>{issues.length}</span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`${styles.column__content} ${isOver ? styles['column__content--over'] : ''}`}
      >
        <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {issues.length === 0 ? (
            <div className={styles.column__empty}>
              No issues in this column
            </div>
          ) : (
            issues.map(issue => (
              <IssueCard key={issue.id} issue={issue} canDrag={canDrag} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};
