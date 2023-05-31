import { style } from '@mui/system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { MetaMaskProvider } from './hooks';
import './styles/index.module.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </BrowserRouter>,
);
