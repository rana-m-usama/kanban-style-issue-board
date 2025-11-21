import React from 'react';
import { Link } from 'react-router-dom';
import { currentUser } from '../../constants/currentUser';
import { ThemeToggle } from '../common/ThemeToggle';
import styles from './Navigation.module.scss';

export const Navigation: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <Link to="/" className={styles.nav__brand}>
          Kanban Issue Board
        </Link>
        
        <div className={styles.nav__actions}>
          <ThemeToggle />
        </div>
        
        <div className={styles.nav__user}>
          <span className={styles.nav__username}>{currentUser.name}</span>
          <span className={styles.nav__role}>({currentUser.role})</span>
        </div>
      </div>
    </nav>
  );
};
