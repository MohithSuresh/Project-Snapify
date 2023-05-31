import styles from '../styles/card.module.css';
import { Link, NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { GrInstallOption } from 'react-icons/gr';
import RunDapp from './RunDapp';

export default function Card(props) {
  function func() {
    // code to run the script for installing the snaps
    console.log('hi');

    // code to redirect to the dapp page
    window.open('/dapps/Bitcoin', '_blank');
  }
  return (
    <div>
      <div className={styles.box}>
        {/* <div className={styles.box1}>
                    <Link className = {styles.link}> <BsFillArrowDownCircleFill style = {{"fontSize":"25px"}}/> </Link>
                </div> */}
        <div className={styles.box2}>
          <h1>{props.title}</h1>
          <p>{props.description}</p>
        </div>
        <div className={styles.box3}>
          {props.price}
          <div className={styles.box4}>
            <Link className={styles.link}>
              {' '}
              <BsFillBookmarkFill
                style={{ fontSize: '25px', marginRight: '8px' }}
              />{' '}
            </Link>
            <Link
              onClick={() => window.open(props.link, '_blank')}
              className={styles.link}
            >
              {' '}
              <BsFillArrowDownCircleFill style={{ fontSize: '25px' }} />{' '}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
