import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './_app';
import reportWebVitals from '../src/reportWebVitals';

// Function to render the app only on the client-side
const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('Gradio-Flow'));
  root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );
};

if (typeof window !== 'undefined') {
  // Ensure this code runs only in the browser
  renderApp();
}

reportWebVitals();
