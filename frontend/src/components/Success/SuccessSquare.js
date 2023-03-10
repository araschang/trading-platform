import React from "react";
import './css/SuccessSquare.css';
import { useNavigate, useLocation } from "react-router-dom";
import SuccessIcon from "./SuccessIcon.png"


const SuccessSquare = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const exchange = state.exchange;
  const money = state.money;

  return (
    <div className="success_square">

      <div className="success_icon">
        <img style={{ width: '50px' }} className="success_icon_image" src={SuccessIcon} alt='SuccessIcon' />
        <span className="success_icon_text">交易成功</span>
      </div>
      <div className="success_items">
        <div className="success_one">
          <span className="success_text_left">交易所</span>
          <span className="success_text_right">{exchange}</span>
        </div>
        <div className="success_one">
          <span className="success_text_left">每筆交易金額</span>
          <span className="success_text_right">
            <span>{money}</span>
            <span className="success_text_unit">USDT</span>
          </span>
        </div>

      </div>



    </div>




  );

}
export default SuccessSquare;
