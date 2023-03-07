import React, { useState, useRef } from "react";
import './css/TrasactionSquare.css';
import { useNavigate } from "react-router-dom";
import { Radio } from 'antd';

const TrasactionSquare = (props) => {
  const { setCurrentPage } = props;
  const navigate = useNavigate()
  const [value, setValue] = useState('money');
  const [exchangeValue, setExchangeValue] = useState('Binance');
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const onExchangeChange = (e) => {
    console.log('radio checked', e.target.value);
    setExchangeValue(e.target.value);
  };
  return (
    <div className="Tra_square">
      <div className="Tra_left">

        <div className='Tra_title'>確認策略參數</div>
        <div className="Tra_left_one">
          <span className="Tra_title_text">MACD指標</span>
          <div className="Tra_title_text_position">
            <span className="Tra_title_text_info_position" ><span>快線長度：</span><span className="Tra_title_text_info">12</span></span>
            <span className="Tra_title_text_info_position"><span>慢線長度：</span><span className="Tra_title_text_info">12</span></span>
            <span className="Tra_title_text_info_position"><span>訊號長度：</span><span className="Tra_title_text_info">12</span></span>
          </div>
        </div>
        <div className="Tra_left_two">
          <span className="Tra_title_text">EMA指標</span>
          <span className="Tra_title_text_info">未選取</span>
        </div>
        <div className="Tra_left_two">
          <span className="Tra_title_text">情緒指標</span>
          <span className="Tra_title_text_info">55</span>
        </div>

      </div>
      <div className="Tra_right">
        <div className='Tra_title'>交易行動</div>
        <div className="Tra_right_one">
          <div className="Tra_right_one_text">
            <span className="Tra_title_text" >交易所</span>
            {/* radio */}
            <div className="str_input_items macd" style={{ width: '200px', flexDirection: 'row', display: 'flex', paddingRight: '10px', justifyContent: 'flex-end' }}>
              <input type="radio" class="str_radio_input" id='radioExchange1' value='Binance' onChange={onExchangeChange} name='exchangeValue' checked={exchangeValue === "Binance"} />
              <label class="str_radio_label" for="radioExchange1"></label><small >幣安</small>
              <input type="radio" class="str_radio_input" id='radioExchange2' value='OKX' onChange={onExchangeChange} name='exchangeValue' checked={exchangeValue === "OKX"} />
              <label class="str_radio_label" for="radioExchange2"></label><small >OKX</small>
            </div>
          </div>
          <div className="Tra_right_one_account">
            <span>帳號 <input className="Tra_input_square account"></input></span>
            <span>密碼 <input className="Tra_input_square account"></input></span>
          </div>

        </div>
        <div className="Tra_right_two">
          <span className="Tra_title_text" >初始本金</span>
          <span className="Tra_title_text_content" style={{ gap: '1rem', fontSize: '12px', paddingRight: '10px' }}><input className="Tra_input_square"></input>TWD</span>

        </div>

        <div style={{ fontSize: '14px', display: 'flex', alignSelf: 'flex-start' }}>
          請點擊選擇並輸入：</div>
        <div className="Tra_right_three">

          <div className="Tra_right_three_position">

            <button className="Tra_right_three_square">
              <span className="Tra_title_text">固定交易金額</span>
              <span className="Tra_title_text_content">單筆交易金額</span>
              <span className="Tra_title_text_content" style={{ gap: '1rem', fontSize: '12px' }}><input className="Tra_input_square"></input>TWD</span>
            </button>
          </div>
          <div className="Tra_right_three_position">

            <button className="Tra_right_three_square">
              <span className="Tra_title_text">固定本金比例</span>
              <span className="Tra_title_text_content">每筆交易金額比例</span>
              <span className="Tra_title_text_content" style={{ gap: '1rem', fontSize: '12px' }}><input className="Tra_input_square"></input>%</span>
            </button>
          </div>


        </div>
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
export default TrasactionSquare;
