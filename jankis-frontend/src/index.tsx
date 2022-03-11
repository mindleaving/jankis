import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './stores/main';
import App from './App';
//import reportWebVitals from './reportWebVitals';

import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/dist/react-notifications.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "flatpickr/dist/themes/light.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
