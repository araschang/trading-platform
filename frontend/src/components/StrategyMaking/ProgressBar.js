import React ,{ useState}from "react";
import "./css/ProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { useNavigate } from "react-router-dom";

const MultiStepProgressBar = ({ page, onPageNumberClick }) => {
  const navigate = useNavigate();

 
  return (
    <ProgressBar>
      <Step>
        {()=>(
          <div
            className={`indexedStep onestep`}
            onClick={() => navigate('/Choose') }
          >
            選擇標的
          </div>
)}
      </Step>
      <Step>
        {({ accomplished}) => (
          <div
            className={`indexedStep twostep`}
            onClick={() => navigate('/Strategy')}
          >
            策略制定
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep threestep`}
            onClick={() => navigate('/Info')}
          >
            資訊一覽
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep fourstep`}
            onClick={() => navigate('/Trasaction')}
          >
            線上交易
          </div>
        )}
      </Step>
    </ProgressBar>
  )};


export default MultiStepProgressBar;
