
import React from 'react';
import ReactDOM from 'react-dom/client';

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-dark-blue/theme.css'; // Tema oscuro que se adapta a tu diseño
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
