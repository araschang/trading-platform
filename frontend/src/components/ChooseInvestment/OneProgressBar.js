import React ,{ useState}from "react";
import "./css/OneProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { useNavigate } from "react-router-dom";


const OneProgressBar = ({ page, onPageNumberClick }) => {
  const navigate = useNavigate();


 
  return (
    <ProgressBar percent={16}>
      <Step>
        {({accomplished})=>(
          <div
            className={`indexedStep ${accomplished ? 'accomplished' : null}`}

          >
            選擇標的
          </div>
)}
      </Step>
      <Step>
        {({ accomplished}) => (
          <div
            className={`indexedStep`}

            style={{backgroundColor:'rgb(190, 190, 190)'}}
          >
            策略制定
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep`}

            style={{backgroundColor:'rgb(190, 190, 190)'}}
          >
            資訊一覽
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep`}

            style={{backgroundColor:'rgb(190, 190, 190)'}}
          >
            線上交易
          </div>
        )}
      </Step>
    </ProgressBar>
  )};


export default OneProgressBar;
