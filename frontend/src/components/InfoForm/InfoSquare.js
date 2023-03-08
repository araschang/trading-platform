/* eslint-disable no-unused-vars */
import React, { useState, useRef, PureComponent } from "react";
import './css/InfoSquare.css';
import { useNavigate, useLocation } from "react-router-dom";
import * as eCharts from "echarts";
import { Radio } from 'antd';
import AuthService from "../../services/auth.service";
import moment from 'moment'

const InfoSquare = (props) => {
  const navigate = useNavigate()
  const { state } = useLocation();
  const email = state.email;
  const exchange = state.exchange;
  const symbol = state.symbol;
  const strategy = state.strategy;
  const timeframe = state.timeframe;
  const backtest = JSON.parse(state.backtest);
  console.log(email);
  // 年複合成長率、最大交易回落、波動率、夏普比率、贏率
  const [cagr, setCAGRValue] = useState();
  const onCAGRChange = (e) => {
    setCAGRValue(e.target.value);
  };
  const [max_drawdown, setMAXDValue] = useState();
  const onMAXDChange = (e) => {
    setMAXDValue(e.target.value);
  };
  const [volatility, setVOLValue] = useState();
  const onVOLChange = (e) => {
    setVOLValue(e.target.value);
  };
  const [sharpe_ratio, setSHARPElValue] = useState();
  const onSHARPEChange = (e) => {
    setSHARPElValue(e.target.value);
  };
  const [win_rate, setWINValue] = useState();
  const onWINChange = (e) => {
    setWINValue(e.target.value);
  };

  var time = [];
  var cum_ret = [];
  var close = [];
  var volume = [];
  for (var i = 0; i < backtest.length; i++) {
    var tempDate = new Date(backtest[i]["time"]);
    tempDate = tempDate.toISOString();
    time.push(tempDate);
    cum_ret.push([tempDate, backtest[i]["cum_ret"]]);
    close.push([tempDate, backtest[i]["close"]]);
    volume.push([tempDate, backtest[i]["volume"]]);
  }
  AuthService.backtestGet(email).then(
    (res) => {
      console.log(res[res.length - 1]);
      res = res[res.length - 1];

      console.log(typeof res.cagr);
      if (typeof res.cagr === 'number') {
        res.cagr = res.cagr.toFixed(2);
      }
      if (typeof res.max_drawdown === 'number') {
        res.max_drawdown = (res.max_drawdown * 100).toFixed(2);
      }
      if (typeof res.volatility === 'number') {
        res.volatility = (res.volatility * 100).toFixed(2);
      }
      if (typeof res.sharpe_ratio === 'number') {
        res.sharpe_ratio = res.sharpe_ratio.toFixed(2);
      }
      if (typeof res.win_rate === 'number') {
        res.win_rate = (res.win_rate * 100).toFixed(2);
      }

      setCAGRValue(res.cagr);
      setMAXDValue(res.max_drawdown);
      setVOLValue(res.volatility);
      setSHARPElValue(res.sharpe_ratio);
      setWINValue(res.win_rate);
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




  class IncomeChart extends PureComponent {
    eChartsRef: any = React.createRef();


    componentDidMount() {
      var myChart = eCharts.init(this.eChartsRef.current);
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        calculable: true,
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: (function (value) {
              return moment(value).format('DD:HH:mm');
            })
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          min: -100,
          max: 100
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
            height: '5%',
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: false,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 10,
            height: '70%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        grid: {
          top: "15%",
          right: '15%'
        },
        color: '#677BF6',
        series: [
          {
            data: cum_ret,
            type: 'line'
          }
        ]
      };

      myChart.setOption(option);
    }

    render() {
      return <div ref={this.eChartsRef} style={{
        width: 480,
        height: 300,
        marginLeft: 10
      }}></div>;
    }
  }
  class PriceChart extends PureComponent {
    //左y軸價格(橘色)，右y軸交易量(黃色)
    eChartsRef: any = React.createRef();

    componentDidMount() {
      const myChart = eCharts.init(this.eChartsRef.current);

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['價格', '交易量'],
          top: '5%'
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: (function (value) {
              return moment(value).format('DD:HH:mm');
            })
          }
        },
        yAxis: [{
          type: 'value',
          name: '交易量',
          position: 'right',
          alignTicks: true,

          axisLine: {
            show: true,

          },
          axisLabel: {
            formatter: '{value} '
          }
        },
        {
          type: 'value',
          name: '價格',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,

          },
          axisLabel: {
            formatter: '{value} 元'
          }
        }
        ],
        grid: {
          top: "20%"
        },
        color: ['#F2C94C', "#F2994A"],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
            height: '5%',
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: false,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 10,
            height: '70%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        series: [
          {
            name: '交易量',
            type: 'line',
            data: volume
          },
          {
            name: '價格',
            type: 'line',
            yAxisIndex: 1,
            data: close
          },
        ]
      };

      myChart.setOption(option);
    }
    render() {
      return <div ref={this.eChartsRef} style={{
        width: 480,
        height: 300,
        marginLeft: 10
      }}></div>;
    }
  }
  class MoodChart extends PureComponent {
    eChartsRef: any = React.createRef();

    componentDidMount() {
      const myChart = eCharts.init(this.eChartsRef.current);

      let option = {
        series: [
          {
            type: 'gauge',
            center: ['60%', '50%'],
            radius: '90%',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            progress: {
              show: true,
              width: 18
            },
            axisLine: {
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            itemStyle: {
              color: '#58D9F9',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            grid: {
              width: '50%'
            },
            axisLabel: {
              show: false
            },

            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 30,
              offsetCenter: [0, '70%']
            },
            data: [
              {
                value: 50
              }
            ]
          }
        ]
      };

      myChart.setOption(option);
    }
    render() {
      return (
        <div>
          <div ref={this.eChartsRef} style={{
            width: 300,
            height: 160,
            marginLeft: 0,
            zIndex: '-1'
          }}></div>
          <div style={{
            display: 'flex',
            width: '300px',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: '10',
            position: 'relative',
            bottom: '50px',
            left: '33px',
          }}>
            <span>負向</span>
            <span>正向</span>
          </div>
        </div>)
    }
  }

  return (
    <div className="info_square">
      {/* title變動 */}
      <div className="info_big_title">比特幣 Bitcoin </div>
      <div className="info_one">
        <div className="info_one_income">
          <div className="info_title">收益走勢</div>
          <div className="info_one_income_square">
            <IncomeChart />
          </div>
        </div>
        <div className="info_one_price">
          <div className="info_title">價格和交易量走勢</div>
          <div className="info_one_price_square">

            <PriceChart />
          </div>
        </div>
      </div>
      <div className="info_two">
        <div className="info_title">回測</div>
        <div className="info_two_square">
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">年複成長率</span>
            <span className="info_two_square_text_content">{cagr}%</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">最大交易回落</span>
            <span className="info_two_square_text_content">{max_drawdown}%</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">波動率</span>
            <span className="info_two_square_text_content">{volatility}%</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">夏普比率</span>
            <span className="info_two_square_text_content">{sharpe_ratio}</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">贏率</span>
            <span className="info_two_square_text_content">{win_rate}%</span>
          </div>
        </div>
      </div>
      <div className="info_three">
        <div className="info_title">情緒分析</div>
        <div className="info_three_square">

          <div className="info_three_mood">
            <div className="info_subtitle">市場情緒</div>
            <MoodChart />
          </div>
          <div className="info_three_topic">
            <div className="info_subtitle">社群媒體熱門話題</div>
          </div>
          <div className="info_three_news">
            <div className="info_subtitle">最近新聞連結</div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-start', flexDirection: 'column', height: '150px', marginLeft: '3rem' }}>
              <div >
                <span className="news_top">Top1</span>
                <div className="news_url">新聞連結</div>
              </div>
              <div>
                <span className="news_top">Top2</span>
                <div className="news_url">新聞連結</div>
              </div>
              <div>
                <span className="news_top">Top3</span>
                <div className="news_url">新聞連結</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="button_group" >
        <button className="info_back_button" onClick={() => navigate('/Strategy')}>
          <span>重新回測</span>
        </button>
        <button className="info_next_button" onClick={() => navigate('/Trasaction', {
          state: {
            exchange: exchange,
            email: email,
            symbol: symbol,
            timeframe: timeframe,
            strategy: strategy,
            backtest: state.backtest
          }
        })}>
          <span>前往交易</span>
        </button>
      </div>



    </div >
  );

}
export default InfoSquare;
