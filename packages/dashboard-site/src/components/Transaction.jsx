import { useLayoutEffect } from 'react';
import styles from '../styles/transaction.module.css';

export default function Transaction(props) {
  return (
    <div>
      <div className={styles.transaction}>
        <div className={styles.left}>
          <p style={{ margin: '0px' }} className={styles.type}>
            {props.type}
          </p>
          <p style={{ margin: '0px' }} className={styles.address}>
            <a
              href={`https://blockstream.info/testnet/tx/${props.address}`}
              style={{ color: '#fff' }}
              target="_blank"
            >
              {props.address}
            </a>
          </p>
        </div>
        <div className={styles.right}>
          <p style={{ margin: '0px' }} className={styles.amount}>
            {props.amount} {props.currency}
          </p>
          <p style={{ margin: '0px' }} className={styles.status}>
            {props.status}
          </p>
          <p style={{ margin: '0px' }} className={styles.time}>
            {props.time}
          </p>
          <p style={{ margin: '0px' }} className={styles.time}>
            Fee: {props.fee}
          </p>
        </div>
      </div>
      <hr></hr>
    </div>
  );
}
