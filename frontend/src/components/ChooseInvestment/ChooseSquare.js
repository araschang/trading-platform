import React, { useState } from "react";
import './css/ChooseSquare.css';
import { useNavigate, useLocation } from "react-router-dom";
import bitcoin from './bitcoin.png'
import ethereum from './ethereum.png'

const ChooseSquare = (props) => {
  // const { setCurrentPage } = props;

  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);
  const email = "yuan2001@live.com";
  const handleChoose = (e) => {
    e.preventDefault();

    navigate('/Strategy', {
      state: {
        email: email,
      }
    });

  };


  return (
    <div className="choose_square">
      <div className="choose_interest">

        <div className="choose_interest_title" >
          <span style={{ alignSelf: 'center' }}>選擇有興趣的金融商品</span>
        </div>
      </div>
      <div className="choose_interest_button">
        <button className="button">
          <img style={{ width: '50%' }} className="image" src={bitcoin} alt='bitcoin' />
          <span style={{ position: 'relative', bottom: '-10%', fontSize: '1.5rem' }} >比特幣</span>
        </button>
        <button className="button">
          <img className="image" src={ethereum} alt='ethereum' />
          <span style={{ position: 'relative', bottom: '-1%', fontSize: '1.5rem' }}>乙太幣</span>
        </button>
      </div>
      <button className="choose_next_button" style={{ top: '10%' }} onClick={handleChoose}>
        <span>下一步</span>
      </button>
    </div>
  );

}
export default ChooseSquare;
