import React from 'react';
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
<<<<<<< HEAD
          top: '75%',
=======
          top: '85%',
>>>>>>> main
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>

        <TrasactionSquare />
<<<<<<< HEAD
=======


>>>>>>> main
      </div>
    </div>
  );
}

export default TrasactionPage;
