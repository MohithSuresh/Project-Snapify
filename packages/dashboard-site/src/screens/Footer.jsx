import styles from '../styles/footer.module.css';
import { Link, NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <div className={styles.mainbox}>
      <h1 className={styles.heading}>
        <Link to="/" className={styles.linkk}>
          SatoshiMoto
        </Link>
      </h1>
      <div className={styles.alllinks}>
        <div className={styles.links}>
          <div className={styles.quicklinks}> Learn More </div>
          <Link to="/dapps" className={styles.link}>
            Dapps
          </Link>
          <Link to="/featured" className={styles.link}>
            Featured
          </Link>
          <Link to="/snaps" className={styles.link}>
            Snaps
          </Link>
          <Link to="/saved" className={styles.link}>
            Saved
          </Link>
          <a href="" target="_blank" className={styles.link}>
            Download
          </a>
          <a href="" target="_blank" className={styles.link}>
            Documentation
          </a>
        </div>
        <div className={styles.links}>
          <div className={styles.quicklinks}> Get Involved </div>
          <a href="" target="_blank" className={styles.link}>
            GitHub
          </a>
          <a href="" target="_blank" className={styles.link}>
            GitCoin
          </a>
          <a href="" target="_blank" className={styles.link}>
            Open Postions
          </a>
          <a href="" target="_blank" className={styles.link}>
            Swag Shop
          </a>
          <a href="" target="_blank" className={styles.link}>
            Press Partnerships
          </a>
        </div>
        <div className={styles.links}>
          <div className={styles.quicklinks}> Connect </div>
          <a href="" target="_blank" className={styles.link}>
            Twitter
          </a>
          <a href="" target="_blank" className={styles.link}>
            Support
          </a>
          <a href="" target="_blank" className={styles.link}>
            News
          </a>
          <a href="" target="_blank" className={styles.link}>
            FAQ's
          </a>
        </div>
      </div>
      <div>@2023 IIT Kharagpur • A Inter IIT Team Project</div>
    </div>
  );
}
