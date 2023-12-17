import React from 'react';
import styles from './styles/modal.module.css';

export default function Modal({ onClose, children }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
}
