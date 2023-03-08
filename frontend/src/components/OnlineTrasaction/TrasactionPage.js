import React, { Component } from 'react';
import TrasactionSquare from "./TrasactionSquare";
import MultiStepProgressBar from './FourProgressBar'
import { useNavigate } from "react-router-dom";
import AlreadyLoginHeader from "../AlreadyLoginHeader"
import "./css/TrasactionPage.css"
function TrasactionPage() {
  const navigate = useNavigate()
  return (
    <div>
      <AlreadyLoginHeader />
      {/* 進度條 */}
      <div style={{
        position: 'absolute',
        width: '674px',
        height: '61px',
        left: '23%',
        top: '15%'
      }}><MultiStepProgressBar /></div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'absolute',
          top: '85%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>

        <TrasactionSquare />

        <div className="button_group" >
          <button className="Tra_back_button" onClick={() => navigate('/Info')}>
            <span>資訊一覽</span>
          </button>
          <button className="Tra_next_button" onClick={() => navigate('/Success')}>
            <span>確認交易</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrasactionPage;
