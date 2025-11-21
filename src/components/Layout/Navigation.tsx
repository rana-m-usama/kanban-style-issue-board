import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { currentUser } from '../../constants/currentUser';
import styles from './Navigation.module.scss';

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className={styles.nav}>
      <div className={styles.nav__container}>
        <Link to="/" className={styles.nav__brand}>
          Kanban Issue Board
        </Link>
        
        <div className={styles.nav__links}>
          <Link 
            to="/" 
            className={`${styles.nav__link} ${location.pathname === '/' ? styles['nav__link--active'] : ''}`}
          >
            Board
          </Link>
        </div>
        
        <div className={styles.nav__user}>
          <span className={styles.nav__username}>{currentUser.name}</span>
          <span className={styles.nav__role}>({currentUser.role})</span>
        </div>
      </div>
    </nav>
  );
};
