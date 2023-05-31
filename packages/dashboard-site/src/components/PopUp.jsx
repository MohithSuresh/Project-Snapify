import styles from '../styles/popup.module.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

export default function PopUp() {
  console.log(styles.buttonn);
  return (
    <Popup
      trigger={
        <Button style={{ position: 'absolute', right: '0px', top: '100%' }}>
          {' '}
          <Link className={styles.buttonn}>Report </Link>
        </Button>
      }
      modal
      nested
      position="right center"
    >
      {(close) => (
        <div className={styles.popup}>
          <h1 className={styles.heading}>Report Dapp</h1>
          <div className={styles.inputdiv}>
            <input
              placeholder="Enter name of the dapp"
              className={styles.inputbox}
            ></input>
          </div>
          <div className={styles.inputdiv}>
            <textarea
              placeholder="Enter the reason for reporting"
              className={styles.concernbox}
            ></textarea>
          </div>
          <div className={styles.submitdiv}>
            <Button style={{ margin: '0px auto 0px' }}>
              {' '}
              <Link className={styles.submit} onClick={() => close()}>
                Submit{' '}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
}
