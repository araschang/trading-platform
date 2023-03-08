import React, { Component } from 'react';
import InfoSquare from "./InfoSquare";
import MultiStepProgressBar from './ThreeProgressBar'
import { useNavigate } from "react-router-dom";
import AlreadyLoginHeader from "../AlreadyLoginHeader"
import "./css/InfoPage.css"
function InfoPage() {
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
          top: '120%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>

        <InfoSquare />

        <div className="button_group" >
          <button className="info_back_button" onClick={() => navigate('/Strategy')}>
            <span>重新回測</span>
          </button>
          <button className="info_next_button" onClick={() => navigate('/Trasaction')}>
            <span>前往交易</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
