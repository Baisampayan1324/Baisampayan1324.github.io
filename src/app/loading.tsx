'use client';

import styles from './styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.wrapper} aria-label="Loading">
      <div className={styles.loader} />
    </div>
  );
}
