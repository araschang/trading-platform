import React ,{ useState}from "react";
import "./css/FourProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { useNavigate } from "react-router-dom";

const MultiStepProgressBar = ({ page, onPageNumberClick }) => {
  const navigate = useNavigate();

 
  return (
    <ProgressBar percent={100}>
      <Step>
        {(accomplished)=>(
          <div
          className={`indexedStep ${accomplished ? 'accomplished' : null}`}
            onClick={() => navigate('/Choose') }
          >
            選擇標的
          </div>
)}
      </Step>
      <Step>
        {({ accomplished}) => (
          <div
          className={`indexedStep ${accomplished ? 'accomplished' : null}`}
            onClick={() => navigate('/Strategy')}
          >
            策略制定
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
          className={`indexedStep ${accomplished ? 'accomplished' : null}`}
            onClick={() => navigate('/Info')}
          >
            資訊一覽
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
          className={`indexedStep ${accomplished ? 'accomplished' : null}`}
          >
            線上交易
          </div>
        )}
      </Step>
    </ProgressBar>
  )};


export default MultiStepProgressBar;
