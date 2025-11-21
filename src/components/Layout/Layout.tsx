import React from 'react';
import { Navigation } from './Navigation';
import { Toast } from '../common/Toast';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.layout__main}>
        {children}
      </main>
      <Toast />
    </div>
  );
};
