import React from 'react';
import { useToastStore } from '../../../store/toastStore';
import styles from './Toast.module.scss';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}>
          <span className={styles.toast__message}>{toast.message}</span>
          <div className={styles.toast__actions}>
            {toast.onUndo && (
              <button
                className={styles.toast__undoBtn}
                onClick={() => {
                  toast.onUndo!();
                  removeToast(toast.id);
                }}
              >
                Undo
              </button>
            )}
            <button
              className={styles.toast__closeBtn}
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
