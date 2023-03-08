import React, { Component } from 'react';
import LoginPage from './components/Login/LoginPage';
import ChoosePage from './components/ChooseInvestment/ChoosePage';
import InfoPage from './components/InfoForm/InfoPage';
import StrategyPage from './components/StrategyMaking/StrategyPage';
import TrasactionPage from './components/OnlineTrasaction/TrasactionPage';
import SuccessPage from './components/Success/SuccessPage';
import { useState } from 'react';
import { Route, Routes } from "react-router-dom";

function App() {
  const [currentPage, setCurrentPage] = useState('ChoosePage');
  return (
    <div>

      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/Choose' element={<ChoosePage />} />
        <Route path='/Strategy' element={<StrategyPage />} />
        <Route path='/Info' element={<InfoPage />} />
        <Route path='/Trasaction' element={<TrasactionPage />} />
        <Route path='/Success' element={<SuccessPage />} />
      </Routes>
    </div>
    // <div>
    //   {currentPage === 'LoginPage' && (<LoginPage setCurrentPage={setCurrentPage}/>)}
    //   {currentPage === 'ChoosePage' && (<ChoosePage setCurrentPage={setCurrentPage}/>)}
    // </div>
  );
}

export default App;

