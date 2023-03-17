import ChooseSquare from "./ChooseSquare";
import React from 'react';
import { useNavigate } from "react-router-dom";
import AlreadyLoginHeader from "../AlreadyLoginHeader"
import "./css/ChoosePage.css"
import OneProgressBar from './OneProgressBar'
function ChoosePage() {
  // const navigate = useNavigate();
  return (
    <div>

      <AlreadyLoginHeader />
      {/* 進度條 */}
      <div className='rwd_progress' style={{
        position: 'absolute',
        width: '674px',
        height: '61px',
        left: '23%',
        top: '15%',

      }}><OneProgressBar /></div>
      <div className='rwd_square'
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>

        <ChooseSquare />




      </div>
    </div>
  );
}

export default ChoosePage;
