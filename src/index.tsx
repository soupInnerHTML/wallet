import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components/App';
import {NotificationProvider} from "@web3uikit/core";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
);
