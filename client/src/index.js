import React from 'react';
import ReactDOM from 'react-dom';
import SearchPage from './components/LandingPage/LandingPage';
import TestPage from './components/TestPage'

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    {/* <SearchPage/> */}
    <TestPage></TestPage>
  </React.StrictMode>,
  document.getElementById('root')
);