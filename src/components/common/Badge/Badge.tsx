import React from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', children }) => {
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {children}
    </span>
  );
};
