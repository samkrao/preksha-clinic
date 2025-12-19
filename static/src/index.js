import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
require ('raw-loader!../node_modules/is_js/is.js');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
