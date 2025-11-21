
import React from 'react';
import ReactDOM from 'react-dom/client';

// tailwind CSS imports
import '@/assets/scss/tailwind.css';
// SCSS imports
import '@/assets/scss/main.scss';

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
