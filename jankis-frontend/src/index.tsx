import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import healthRecordStore from './localComponents/redux/store/healthRecordStore';
import App from './App';

import './localComponents/styles/index.css';
import './sharedCommonComponents/styles/common.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/dist/react-notifications.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "flatpickr/dist/themes/light.css";


ReactDOM.render(
  <React.StrictMode>
    <Provider store={healthRecordStore}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
