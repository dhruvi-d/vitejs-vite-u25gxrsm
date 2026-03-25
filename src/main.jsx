import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure this points to your App.jsx file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
