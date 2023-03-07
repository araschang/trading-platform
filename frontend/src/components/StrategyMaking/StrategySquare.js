/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import './css/StrategySquare.css';
import { useNavigate } from "react-router-dom";
import { Radio } from 'antd';
import AuthService from "../../services/auth.service";

const StrategySquare = (props) => {
  // const { setCurrentPage } = props;
  const navigate = useNavigate()

  const [exchange] = useState('Binance');
  const [email] = useState('happy@hotmail.com');
  const [symbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1m');
  const onTimeChange = (e) => {
    setTimeframe(e.target.value);
  };
  const [monthValue, setMonthValue] = useState('1month');
  const onMonthChange = (e) => {
    setMonthValue(e.target.value);
  };
  const [checkedStra, setCheckedStra] = useState({});

  // MACD
  const [fast, setFastValue] = useState();
  const onFastChange = (e) => {
    setFastValue(e.target.value);
  };
  const [slow, setSlowValue] = useState();
  const onSlowChange = (e) => {
    setSlowValue(e.target.value);
  };
  const [signal, setSignalValue] = useState();
  const onSignalChange = (e) => {
    setSignalValue(e.target.value);
  };
  // Emotion
  const [moodLowValue, setMoodLowValue] = useState('buy');
  const onLowChange = (e) => {
    setMoodLowValue(e.target.value);
  };
  const [moodHeightValue, setMoodHeighValue] = useState('buy');
  const onHeightChange = (e) => {
    setMoodHeighValue(e.target.value);
  };
  // EMA
  const [ema_short_len, setShortValue] = useState();
  const onShortChange = (e) => {
    setShortValue(e.target.value);
  };
  const [ema_long_len, setLongValue] = useState();
  const onLongChange = (e) => {
    setLongValue(e.target.value);
  };


  const handleStrategy = (e) => {
    // e.preventDefault();
    console.log(checkedStra);
    AuthService.backtest(exchange, email, symbol, timeframe, checkedStra, monthValue).then(
      (res) => {
        // navigate("/profile");
        // window.location.reload();
        // console.log(email, password);
        // console.log(res);

        if (res === 200) {
          navigate('/Choose');
        }
        // else {
        //   window.location.reload();
        // }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        // setLoading(false);
        // setMessage(resMessage);
      }
    );
  };



  const handleCheck = (e) => {
    // updating an object instead of a Map
    if (e.target.name === "MACD")
      // setCheckedStra({ ...checkedStra, [e.target.name]: { fast: fast } });
      setCheckedStra({ ...checkedStra, [e.target.name]: { "fast": fast, "slow": slow, "signal": signal } });

    if (e.target.name === "EMA")
      // setCheckedStra({ ...checkedStra, [e.target.name]: { fast: fast } });
      setCheckedStra({ ...checkedStra, [e.target.name]: { "ema_short_len": ema_short_len, "ema_long_len": ema_long_len } });
  }

  useEffect(() => {
    console.log("checkedItems: ", checkedStra);
  }, [checkedStra]);

  const strategyMethods = {
    MACD: {
      name: 'MACD',
      key: 'MACD',
      label: 'MACD',
    },
    Emotion: {
      name: 'Emotion',
      key: 'Emotion',
      label: 'Emotion',
    },
    EMA: {
      name: 'EMA',
      key: 'EMA',
      label: 'EMA',
    }
  };







  return (
    <div className="square">

      {/* 第一行 */}
      <div className="square_first"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: '900px'
        }}>
        <div className="square_item" style={{ width: '430px', height: '150px' }}>  {/* time frame */}
          <div className="right"
            style={{
              width: '450px',
              height: '130px',
              display: 'flex',
              justifyContent: 'space-evenly',
              gap: '5px',
              alignItems: 'flex-start',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
            <div className="str_title">
              <span className="str_title_text">Time Frame</span>
              <span className="str_title_text_ps">備註：K線的時間間隔，越小訊號越多</span>
            </div>
            {/* radio */}
            <div className="str_input_items macd" style={{ width: '300px', flexDirection: 'row', display: 'flex', marginLeft: '3rem', marginBottom: '1rem' }}>
              <input type="radio" class="str_radio_input" id='radioTime1' value='1m' onChange={onTimeChange} name='timeValue' checked={timeframe === "1m"} />
              <label class="str_radio_label" for="radioTime1"></label><small >1m</small>
              <input type="radio" class="str_radio_input" id='radioTime2' value='5m' onChange={onTimeChange} name='timeValue' checked={timeframe === "5m"} />
              <label class="str_radio_label" for="radioTime2"></label><small >5m</small>
              <input type="radio" class="str_radio_input" id='radioTime3' value='1h' onChange={onTimeChange} name='timeValue' checked={timeframe === "1h"} />
              <label class="str_radio_label" for="radioTime3"></label><small >1h</small>
              <input type="radio" class="str_radio_input" id='radioTime4' value='4h' onChange={onTimeChange} name='timeValue' checked={timeframe === "4h"} />
              <label class="str_radio_label" for="radioTime4"></label><small >4h</small>
              <input type="radio" class="str_radio_input" id='radioTime5' value='1d' onChange={onTimeChange} name='timeValue' checked={timeframe === "1d"} />
              <label class="str_radio_label" for="radioTime5"></label><small >1d</small>
            </div>
          </div>
        </div>
        <div className="square_item" style={{ width: '430px', height: '150px' }}>  {/* 回測 */}
          <div className="right"
            style={{
              width: '450px',
              height: '130px',
              display: 'flex',
              justifyContent: 'space-evenly',
              gap: '5px',
              alignItems: 'flex-start',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
            <div className="str_title">
              <span className="str_title_text">回測時間設定</span>
              <span className="str_title_text_ps">備註：歷史資訊回測時間的範圍</span>
            </div >
            {/* radio */}
            <div className="str_input_items macd" style={{ width: '200px', flexDirection: 'row', display: 'flex', marginLeft: '4rem', marginBottom: '1rem' }}>
              <input type="radio" class="str_radio_input" id='radioMonth1' value='1month' onChange={onMonthChange} name='monthValue' checked={monthValue === "1month"} />
              <label class="str_radio_label" for="radioMonth1"></label><small >1個月</small>
              <input type="radio" class="str_radio_input" id='radioMonth2' value='3month' onChange={onMonthChange} name='monthValue' checked={monthValue === "3month"} />
              <label class="str_radio_label" for="radioMonth2"></label><small >3個月</small>
              <input type="radio" class="str_radio_input" id='radioMonth3' value='6month' onChange={onMonthChange} name='monthValue' checked={monthValue === "6month"} />
              <label class="str_radio_label" for="radioMonth3"></label><small >6個月</small>
            </div>
          </div>
        </div>
      </div>
      {/* 一和二之間的文字 */}
      <div style={{ width: '900px', border: '0.5px solid #C6CACC' }}></div>
      <div style={{ width: '900px', }}>請選擇策略(至少選擇一項)：</div>
      {/* 第二行 */}
      <div className="square_second"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: '900px',
          height: '240px',
          gap: '10px'
        }}>
        <div className="square_item">  {/* MACD */}
          <input type='checkbox' class="str_checkbox" id='checkbox1' name={strategyMethods['MACD'].name} checked={checkedStra[strategyMethods['MACD'].name]} onChange={handleCheck} />
          <label class="str_label" for="checkbox1"></label>
          <div className="right"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
            <div className="str_title">
              <span className="str_title_text">MACD策略</span>
              <span className="str_title_text_ps">備註：黃金交叉時買進、死亡交叉賣出</span>
            </div>
            <div className="str_input">
              <div className="str_input_items macd">
                <span className="str_input_text">快線長度：</span>
                <input className="str_input_square macd" value={fast} onChange={onFastChange}></input>
              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">慢線長度：</span>
                <input className="str_input_square macd" value={slow} onChange={onSlowChange}></input>
              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">訊號長度：</span>
                <input className="str_input_square macd" value={signal} onChange={onSignalChange}></input>
              </div>
            </div>
          </div>
        </div>
        <div className="square_item">  {/* 情緒 */}
          <input type='checkbox' class="str_checkbox" id='checkbox2' name={strategyMethods['Emotion'].name} checked={checkedStra[strategyMethods['Emotion'].name]} onChange={handleCheck} />
          <label class="str_label" for="checkbox2"></label>
          <div className="right"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
            <div className="str_title">
              <span className="str_title_text">情緒策略</span>
              <span className="str_title_text_ps">備註：依標的性質根據情緒買進或賣出</span>
            </div>
            <div className="str_input">
              <div className="str_input_items macd">
                <span className="str_input_text">低於：</span>
                <input className="str_input_square"></input>
                {/* {radio} */}
                <input type="radio" style={{ marginRight: '-1px' }} class="str_radio_input" id='radioLow1' value='buy' onChange={onLowChange} name='moodLowValue' checked={moodLowValue === "buy"} />
                <label class="str_radio_label" for="radioLow1"></label><small >買</small>
                <input type="radio" style={{ marginRight: '-1px' }} class="str_radio_input" id='radioLow2' value='sold' onChange={onLowChange} name='moodLowValue' checked={moodLowValue === "sold"} />
                <label class="str_radio_label" for="radioLow2"></label><small>賣</small>

              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">高於：</span>
                <input className="str_input_square"></input>

                {/* {radio} */}
                <input type="radio" style={{ marginRight: '-1px' }} class="str_radio_input" id='radioHeight1' value='buy' onChange={onHeightChange} name='moodHeightValue' checked={moodHeightValue === "buy"} />
                <label class="str_radio_label" for="radioHeight1"></label><small>買</small>
                <input type="radio" style={{ marginRight: '-1px' }} class="str_radio_input" id='radioHeight2' value='sold' onChange={onHeightChange} name='moodHeightValue' checked={moodHeightValue === "sold"} />
                <label class="str_radio_label" for="radioHeight2"></label><small>賣</small>


              </div>
            </div>
          </div>
        </div>
        <div className="square_item"> {/* EMA */}
          <input type='checkbox' class="str_checkbox" id='checkbox3' name={strategyMethods['EMA'].name} checked={checkedStra[strategyMethods['EMA'].name]} onChange={handleCheck} />
          <label class="str_label" for="checkbox3"></label>
          <div className="right"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
            <div className="str_title">
              <span className="str_title_text">EMA策略</span>
              <span className="str_title_text_ps">備註：黃金交叉時買進、死亡交叉賣出</span>
            </div>
            <div className="str_input">
              <div className="str_input_items macd">
                <span className="str_input_text">短線：</span>
                <input className="str_input_square" value={ema_short_len} onChange={onShortChange}></input>
              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">長線：</span>
                <input className="str_input_square" value={ema_long_len} onChange={onLongChange}></input>
              </div>
            </div>
          </div>

        </div>
      </div>
      <button className="next_button " onClick={() => handleStrategy()}>
        <span >一鍵生成</span>
      </button>
    </div>



  );

};

export default StrategySquare;
