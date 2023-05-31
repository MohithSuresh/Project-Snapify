import PopUp from '../components/PopUp';
import Card from '../components/Card';
import data from './response.json';
import { useEffect, useState } from 'react';

export default function Featured() {
  const [response, setResponse] = useState([]);
  // dummy data
  useEffect(() => {
    setResponse(data);
  });
  return (
    <div
      style={{ width: '75.5%', margin: '0px auto 0px', position: 'relative' }}
    >
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginTop: '20px' }}>
        Snaps
      </h2>
      {/* {response.map((item) => {
        return (
          <Card
            key={item.key}
            title={item.title}
            description={item.description}
            link={item.link}
            price={item.price}
            install_link={item.install_link}
          />
        );
      })} */}
      {/* <Popup  trigger={<Button style = {{"position":"absolute","right":"0px","top":"100%"}} > <Link className={styles.buttonn}>Report</Link></Button>} modal nested position="right center">

                <div className = {styles.popup}>Report</div>
            </Popup> */}
      <PopUp />
    </div>
  );
}
