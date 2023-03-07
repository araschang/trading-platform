import React, { useState, useRef } from "react";
import './css/ChooseSquare.css';
import { useNavigate } from "react-router-dom";
import bitcoin from './bitcoin.png'
import ethereum from './ethereum.png'

const ChooseSquare = (props) => {
  const {setCurrentPage} = props;
  const navigate = useNavigate()

  return (
    <div className="choose_square">
      <div className="choose_interest">

        <div className="choose_interest_title" >
          <span style={{alignSelf:'center'}}>選擇有興趣的金融商品</span>
        </div>
        </div>
        <div className="choose_interest_button">
          <button className="button">
          <img style={{width:'50%'}} className="image" src={bitcoin} alt='bitcoin'/>
          <span style={{position:'relative',bottom:'-10%',fontSize:'1.5rem'}} >比特幣</span>
          </button>
          <button className="button">
          <img className="image" src={ethereum} alt='ethereum'/>
          <span style={{position:'relative',bottom:'-1%',fontSize:'1.5rem'}}>乙太幣</span>
          </button>
        </div>

    </div>
  );

  }
export default ChooseSquare;
