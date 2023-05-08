import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  // Using <React.Fragment> here is not strictly necessary, but we can use it when we have multiple components to render
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);