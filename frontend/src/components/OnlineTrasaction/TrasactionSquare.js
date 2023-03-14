import React, { useState } from "react";
import './css/TrasactionSquare.css';
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../services/auth.service";

const TrasactionSquare = (props) => {
  const navigate = useNavigate()
  const { setCurrentPage } = props;
  const { state } = useLocation();
  const email = AuthService.getCurrentUserEmail();
  const symbol = state.symbol;
  const timeframe = state.timeframe;
  const strategy = state.strategy;
  const backtest = state.backtest;
  console.log(strategy);
  var pass_phrase = "";

  const [value, setValue] = useState('money');
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const [exchange, setExchangeValue] = useState(state.exchange);
  const onExchangeChange = (e) => {
    setExchangeValue(e.target.value);
    if (exchange === "OKX")
      pass_phrase = "Aras3427@";
  };

  const [api_key, setAPIKValue] = useState();
  const onAPIKChange = (e) => {
    setAPIKValue(e.target.value);
  };

  const [api_secret, setAPISecretValue] = useState();
  const onAPISecretChange = (e) => {
    setAPISecretValue(e.target.value);
  };

  const [money, setMoneyValue] = useState();
  const onMoneyChange = (e) => {
    setMoneyValue(e.target.value);
  };


  const handleTranscation = (e) => {
    // e.preventDefault();

    // setMessage("");
    console.log({ email, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy });
    AuthService.tradeImply(email, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy).then(
      (res) => {
        console.log(res);
        if (res === 200) {
          navigate('/Success', {
            state: {
              exchange: exchange,
              money: money,
            }
          });
        }

      }
    );
  };

  const handleBackInfo = (e) => {

    navigate('/Info', {
      state: {
        exchange: exchange,
        email: email,
        symbol: symbol,
        timeframe: timeframe,
        strategy: strategy,
        backtest: backtest
      }
    });

  };





  return (
    <div>
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
          <div className="Tra_left_two">
            <span className="Tra_title_text">EMA指標</span>
            <div className="Tra_title_text_position" style={{ height: '80px' }}>
              {("EMA" in strategy) &&
                (<span className="Tra_title_text_info_position" ><span>短線：</span><span className="Tra_title_text_info_two">{strategy['EMA']['ema_short_len']}</span></span>)}
              {("EMA" in strategy) &&
                (<span className="Tra_title_text_info_position" ><span>長線：</span><span className="Tra_title_text_info_two">{strategy['EMA']['ema_long_len']}</span></span>)}
              {!("EMA" in strategy) && (<span className="Tra_title_text_info">未選取</span>)}
            </div>
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
          <div className="Tra_right_two">
            <span className="Tra_title_text" >每筆交易金額</span>
            <span className="Tra_title_text_content" style={{ gap: '1rem', fontSize: '12px', paddingRight: '10px' }}>
              <input type="text" className="Tra_input_square" name="money" value={money} onChange={onMoneyChange}></input>

              USDT</span>


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




      </div >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="button_group" >
          <button className="Tra_back_button" onClick={handleBackInfo}>
            <span>資訊一覽</span>
          </button>
          <button className="Tra_next_button" onClick={handleTranscation}>
            <span>確認交易</span>
          </button>
        </div></div>
    </ div>
  );

}
export default TrasactionSquare;
