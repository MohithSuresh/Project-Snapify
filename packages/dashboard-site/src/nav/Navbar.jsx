// export default function Navbar() {
//     return (
//         <div>
//             <h1>Navbar</h1>
//         </div>
//     )
// }

import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap } from '../utils';
import styles from '../styles/navbar.module.css';

export default function ButtonAppBar() {
  const [state, dispatch] = useContext(MetaMaskContext);

  useState(() => {
    if (state.error)
      window.alert('An error has happened: ' + state.error.message);
  }, [state.error]);

  // useState(() => {
  //   if (!state.isFlask)
  //     window.alert(
  //       'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
  //     );
  // }, [state.isFlask]);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: 'black' }}>
        <Toolbar className={styles.navbar}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit">
              <Link to="/" className={styles.headlink}>
                {' '}
                D Snap Store{' '}
              </Link>
            </Button>
          </Typography>
          <div>
            <Button
              color="inherit"
              className={styles.link}
              onClick={handleConnectClick}
              disabled={!state.isFlask}
            >
              {!state.installedSnap ? 'Install Snap' : 'Reconnect Snap'}
            </Button>{' '}
            <Button color="inherit">
              <Link to="/dapps" className={styles.link}>
                {' '}
                Dapps{' '}
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/featured" className={styles.link}>
                {' '}
                Featured{' '}
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/snaps" className={styles.link}>
                {' '}
                Snaps{' '}
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/saved" className={styles.link}>
                {' '}
                Saved{' '}
              </Link>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
