import React, { useLayoutEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dapps from './screens/Dapps.jsx';
import Featured from './screens/Featured.jsx';
import Snaps from './screens/Snaps.jsx';
import Saved from './screens/Saved.jsx';
import Navbar from './nav/Navbar.jsx';
import Footer from './screens/Footer.jsx';
import RunDapp from './components/RunDapp.jsx';

import styles from './styles/app.module.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
    },
  },
});

function App() {
  console.log(styles);
  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#061121';
    document.body.style.margin = '0px';
  });
  return (
    <div className={styles.app}>
      <Navbar className={styles.navbar} />
      <Routes>
        <Route path="/" element={<Dapps />} />
        <Route path="/dapps" exact element={<Dapps />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/snaps" element={<Snaps />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/dapps/bitcoin" element={<RunDapp />} />
        <Route
          path="/*"
          element={
            <h1 style={{ textAlign: 'center', marginTop: '25px' }}>
              {' '}
              404 Page Not Found
            </h1>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
