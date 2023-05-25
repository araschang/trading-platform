/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback, Fragment } from "react";
import './css/StrategySquare.css';
import { useNavigate, useLocation } from "react-router-dom";
import { Radio } from 'antd';
import AuthService from "../../services/auth.service";

const StrategySquare = (props) => {
  // const { setCurrentPage } = props;
  const navigate = useNavigate()
  const { state } = useLocation();
  const [exchange] = useState('Binance');
  const email = AuthService.getCurrentUserEmail();
  const [symbol] = useState('BTC/USDT');
  const [checkedStra, setCheckedStra] = useState({});
  const [fast, setFastValue] = useState();
  const [slow, setSlowValue] = useState();
  const [signal, setSignalValue] = useState();
  const [ema_short_len, setShortValue] = useState();
  const [ema_long_len, setLongValue] = useState();


  const [timeframe, setTimeframe] = useState('');
  const [monthValue, setMonthValue] = useState('');

  const handleChange = (setValue) => (e) => {
    setValue(e.target.value);
  };

  const timeValues = [
    { value: '1m', label: '1m', disabled: monthValue === '3d' || monthValue === '1mon' || monthValue === '3mon' || monthValue === '6mon' },
    { value: '5m', label: '5m', disabled: monthValue === '1mon' || monthValue === '3mon' || monthValue === '6mon' },
    { value: '1h', label: '1h', disabled: monthValue === '3mon' || monthValue === '6mon' },
    { value: '4h', label: '4h', disabled: monthValue === '1d' || monthValue === '3d' },
    { value: '1d', label: '1d', disabled: monthValue === '1d' || monthValue === '3d' || monthValue === '1mon' },
  ];

  const monthValues = [
    { value: '1d', label: '1天', disabled: timeframe === '4h' || timeframe === '1d' },
    { value: '3d', label: '3天', disabled: timeframe === '1m' || timeframe === '4h' || timeframe === '1d' },
    { value: '1mon', label: '1個月', disabled: timeframe === '1m' || timeframe === '5m' || timeframe === '1d' },
    { value: '3mon', label: '3個月', disabled: timeframe === '1m' || timeframe === '5m' || timeframe === '1h' },
    { value: '6mon', label: '6個月', disabled: timeframe === '1m' || timeframe === '5m' || timeframe === '1h' },
  ];




  function checkUserInput() {
    const selectedMonthValue = monthValues.find((value) => value.value === monthValue);
    const selectedTimeValue = timeValues.find((value) => value.value === timeframe);

    if (!selectedMonthValue || !selectedTimeValue) {
      alert('請選擇一個 Time Frame 和設定回測時間');
      return false;
    }

    return true;
  }

  function checkStraInput() {
    const checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
    if (checkedBoxes.length === 0) {
      alert('請至少選擇一個策略');
      return false;
    }
    for (let i = 0; i < checkedBoxes.length; i++) {
      const stra = checkedBoxes[i].name;
      console.log(stra);
      const parameters = checkedStra[stra];
      console.log(parameters);
      for (let key in parameters) {
        const value = parameters[key];
        if (!value) {
          alert(`請輸入${stra}策略的${key}參數`);
          return false;
        }
      }
    }
    return true;
  }

  const handleCheckedStra = useCallback((name, value) => {
    setCheckedStra(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        ...value
      }
    }));
  }, [setCheckedStra]);

  const validateInput = (name, value) => {
    var fast_value = fast;
    var slow_value = slow;
    var signal_value = signal;
    var ema_long_len_value = ema_long_len;
    var ema_short_len_value = ema_short_len;

    const valueRange = {
      fast: [0, 100],
      signal: [0, 200],
      slow: [0, 100],
      ema_short_len: [0, 200],
      ema_long_len: [0, 200]
    };

    const alertMessage = {
      fast: 'MACD 快線長度需「小於」慢線長度',
      slow: 'MACD 快線長度需「小於」慢線長度',
      ema_short_len: 'EMA 短線長度需「小於」長線長度',
      ema_long_len: 'EMA 短線長度需「小於」長線長度'
    };

    if (value < valueRange[name][0] || value > valueRange[name][1]) {
      alert(`${name} 應介於 ${valueRange[name][0]} 到 ${valueRange[name][1]}`);
      return false;
    }

    if (alertMessage[name] && ((name === 'fast' && Number(value) >= slow_value) || (name === 'slow' && Number(value) < fast_value) || (name === 'ema_short_len' && Number(value) >= ema_long_len_value) || (name === 'ema_long_len' && Number(value) < ema_short_len_value))) {
      alert(alertMessage[name]);
      return false;
    }

    return true;
  };

  const handleInputChange = useCallback((e) => {

    const { name, value } = e.target;
    switch (name) {
      case 'fast':
        handleCheckedStra('MACD', { [name]: value });
        setFastValue(value);
        break;
      case 'slow':
        handleCheckedStra('MACD', { [name]: value });
        setSlowValue(value);
        break;
      case 'signal':
        handleCheckedStra('MACD', { [name]: value });
        setSignalValue(value);
        break;
      case 'ema_short_len':
        handleCheckedStra('EMA', { [name]: value });
        setShortValue(value);
        break;
      case 'ema_long_len':
        handleCheckedStra('EMA', { [name]: value });
        setLongValue(value);
        break;
      default:
        break;
    }
  }, [handleCheckedStra, setFastValue, setSlowValue, setSignalValue, setShortValue, setLongValue]);

  const handleCheck = useCallback((e) => {
    const { name, checked } = e.target;
    switch (name) {
      case 'MACD':
        if (!checked) {
          handleCheckedStra(name, { fast: '', slow: '', signal: '' });
          setCheckedStra(prevState => {
            const { [name]: value, ...newState } = prevState;
            return newState;
          });
        } else {
          handleCheckedStra(name, { fast, slow, signal });
        }
        break;
      case 'EMA':
        if (!checked) {
          handleCheckedStra(name, { ema_short_len: '', ema_long_len: '' });
          setCheckedStra(prevState => {
            const { [name]: value, ...newState } = prevState;
            return newState;
          });
        } else {
          handleCheckedStra(name, { ema_short_len, ema_long_len });
        }
        break;
      default:
        break;
    }
  }, [handleCheckedStra, fast, slow, signal, ema_short_len, ema_long_len]);

  const handleStrategy = useCallback((e) => {
    // Add input validation before submitting the form
    let isInputValid = true;
    for (const [key, value] of Object.entries(checkedStra)) {
      for (const [sub_key, sub_value] of Object.entries(checkedStra[key])) {
        isInputValid = validateInput(sub_key, sub_value) && isInputValid;
      }
    }

    const isRadioValid = checkUserInput();
    const isStraValid = checkStraInput();

    // e.preventDefault();
    const checkedStrategy = Object.keys(checkedStra).map(key => ({ [key]: checkedStra[key] }));
    console.log(checkedStrategy);
    console.log(typeof checkedStrategy);
    if (isInputValid && isRadioValid && checkStraInput) {
      AuthService.backtest(exchange, email, symbol, timeframe, checkedStrategy, monthValue).then(
        (res) => {
          navigate('/Info', {
            state: {
              exchange: exchange,
              email: email,
              symbol: symbol,
              timeframe: timeframe,
              strategy: checkedStra,
              backtest: res
            }
          });
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
    } else {
      // Handle invalid input
    }
  });

  useEffect(() => {
    console.log("checkedItems: ", checkedStra);

  }, [checkedStra, timeValues, monthValues]);

  const strategyMethods = {
    MACD: {
      name: 'MACD',
      key: 'MACD',
      label: 'MACD',
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
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: '700px'
        }}>
        <div className="square_item" style={{ width: '430px', height: '150px' }}>  {/* time frame */}
          <div className="right"
            style={{
              width: '300px',
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
            <div className="str_input_items macd" style={{ paddingLeft: '0px', width: '250px', flexDirection: 'row', display: 'flex', marginLeft: '2rem', marginBottom: '1rem' }}>
              {timeValues.map((value) => (
                <Fragment key={value.value}>
                  <input
                    type="radio"
                    className="str_radio_input"
                    id={`radioTime${value.value}`}
                    value={value.value}
                    onChange={handleChange(setTimeframe)}
                    name="timeValue"
                    checked={timeframe === value.value}
                    disabled={value.disabled}
                  />
                  <label className="str_radio_label" htmlFor={`radioTime${value.value}`} />
                  <small>{value.label}</small>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="square_item" style={{ width: '430px', height: '150px' }}>  {/* 回測 */}
          <div className="right"
            style={{
              width: '350px',
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
            <div className="str_input_items macd" style={{ paddingLeft: '0px', width: '350px', flexDirection: 'row', display: 'flex', marginLeft: '2rem', marginBottom: '1rem' }}>
              {monthValues.map((value) => (
                <Fragment key={value.value}>
                  <input
                    type="radio"
                    className="str_radio_input"
                    id={`radioMonth${value.value}`}
                    value={value.value}
                    onChange={handleChange(setMonthValue)}
                    name="monthValue"
                    checked={monthValue === value.value}
                    disabled={value.disabled}
                  />
                  <label className="str_radio_label" htmlFor={`radioMonth${value.value}`} />
                  <small>{value.label}</small>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 一和二之間的文字 */}
      <div style={{ width: '600px', border: '0.5px solid #C6CACC' }}></div>
      <div style={{ width: '650px', }}>請選擇策略：</div>
      {/* 第二行 */}
      <div className="square_second"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: '700px',
          height: '240px',
          gap: '10px'
        }}>
        <div className="square_item" style={{ marginLeft: '1rem' }}>  {/* MACD */}
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
                <input type="value" name='fast' className="str_input_square macd" value={fast} onChange={handleInputChange}></input>
              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">慢線長度：</span>
                <input type="value" name='slow' className="str_input_square macd" value={slow} onChange={handleInputChange}></input>
              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">訊號長度：</span>
                <input type="value" name='signal' className="str_input_square macd" value={signal} onChange={handleInputChange}></input>
              </div>
            </div>
          </div>
        </div>

        <div className="square_item" style={{ width: '280px' }}> {/* EMA */}
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
                <input type="value" name='ema_short_len' className="str_input_square" value={ema_short_len} onChange={handleInputChange}></input>
              </div>
              <div className="str_input_items macd">
                <span className="str_input_text">長線：</span>
                <input type="value" name='ema_long_len' className="str_input_square" value={ema_long_len} onChange={handleInputChange}></input>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* 第三行 */}
      <div style={{ width: '700px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button className="next_button " onClick={() => handleStrategy()}>
          <span >一鍵生成</span>
        </button>
      </div>
    </div>



  );
};

export default StrategySquare;
