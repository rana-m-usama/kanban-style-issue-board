import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Issue } from '../../types';
import { Badge } from '../common/Badge';
import { calculatePriority } from '../../utils/priorityCalculator';
import { getSeverityLabel } from '../../utils/severityLabels';
import { getSeverityVariant } from '../../utils/badgeVariants';
import styles from './IssueCard.module.scss';

interface IssueCardProps {
  issue: Issue;
  canDrag: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, canDrag }) => {
  const navigate = useNavigate();
  const priority = calculatePriority(issue);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: issue.id,
    disabled: !canDrag
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (!isDragging) {
      navigate(`/issue/${issue.id}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.card} ${isDragging ? styles['card--dragging'] : ''} ${!canDrag ? styles['card--disabled'] : ''}`}
      onClick={handleClick}
    >
      <div className={styles.card__header}>
        <h3 className={styles.card__title}>{issue.title}</h3>
        <span className={styles.card__id}>{issue.id}</span>
      </div>
      
      <p className={styles.card__description}>{issue.description}</p>
      
      <div className={styles.card__tags}>
        {issue.tags.map(tag => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>
      
      <div className={styles.card__footer}>
        <span className={styles.card__assignee}>👤 {issue.assignee}</span>
        <Badge variant={getSeverityVariant(issue.severity)}>
          {getSeverityLabel(issue.severity)}
        </Badge>
      </div>
      
      <div className={styles.card__priority}>
        Priority: {priority}
      </div>
    </div>
  );
};
