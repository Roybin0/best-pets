import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { OwnerDataProvider } from './contexts/OwnerDataContext';
import { PetDataProvider } from './contexts/PetDataContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <OwnerDataProvider>
          <PetDataProvider>
            <App />
          </PetDataProvider>
        </OwnerDataProvider>
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
