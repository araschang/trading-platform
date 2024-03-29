/* eslint-disable no-unused-vars */
import React, { useState, useRef, PureComponent, useEffect } from "react";
import './css/InfoSquare.css';
import { useNavigate, useLocation } from "react-router-dom";
import * as eCharts from "echarts";
import { Radio } from 'antd';
import AuthService from "../../services/auth.service";
import moment from 'moment';

const InfoSquare = (props) => {

  const navigate = useNavigate()
  const { state } = useLocation();
  console.log(state.exchange);
  const email = AuthService.getCurrentUserEmail();
  const exchange = state.exchange;
  const symbol = state.symbol;
  const strategy = state.strategy;
  const timeframe = state.timeframe;

  const [isNewsMounted, setNewsMounted] = useState(true);
  const [isSentiMounted, setSentiMounted] = useState(true);
  const [isCloudMounted, setCloudMounted] = useState(true);

  // 年複合成長率、最大交易回落、波動率、夏普比率、贏率
  const [cagr, setCAGRValue] = useState("Loading...");
  const onCAGRChange = (e) => {
    setCAGRValue(e.target.value);
  };
  const [max_drawdown, setMAXDValue] = useState("Loading...");
  const onMAXDChange = (e) => {
    setMAXDValue(e.target.value);
  };
  const [volatility, setVOLValue] = useState("Loading...");
  const onVOLChange = (e) => {
    setVOLValue(e.target.value);
  };
  const [sharpe_ratio, setSHARPElValue] = useState("Loading...");
  const onSHARPEChange = (e) => {
    setSHARPElValue(e.target.value);
  };
  const [win_rate, setWINValue] = useState("Loading...");
  const onWINChange = (e) => {
    setWINValue(e.target.value);
  };
  const [isBacktestMounted, setBacktestMounted] = useState(true);

  useEffect(() => {
    if (isBacktestMounted) {
      console.log("five value useffect calls")
      AuthService.backtestGet(email).then(
        (res) => {
          console.log(res[res.length - 1]);
          res = res[res.length - 1];
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

          setCAGRValue(res.cagr + '%');
          setMAXDValue(res.max_drawdown + '%');
          setVOLValue(res.volatility + '%');
          setSHARPElValue(res.sharpe_ratio + '%');
          setWINValue(res.win_rate + '%');
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
      setBacktestMounted(false);
    }
  }, [isBacktestMounted]);

  function WordCloud() {
    const [wordcloud, setCloud] = useState("");
    const [isLoading, setLoading] = useState(true);
    var cloudRes;
    useEffect(() => {
      if (isCloudMounted) {
        console.log('useEffect word cloud run ');
        AuthService.wordCloudGet().then(
          (res) => {
            cloudRes = res;
            setCloud(res);
            setLoading(false);
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            console.log(resMessage);
            setLoading(false);
          }
        );
      }
      return () => {
        if (cloudRes !== undefined)
          setCloudMounted(false);
      };
    }, [isCloudMounted]);

    return (
      <div className="info_three_topic">
        <div className="info_subtitle">社群媒體熱門話題</div>
        {isLoading ? (
          <span className="info_two_square_text_content" style={{ bottom: '26%', left: '49%', position: 'absolute' }}> Loading...</span>
        ) : (
          <img
            src={`data:image/jpeg;base64,${wordcloud}`}
            style={{ bottom: '17%', height: '220px', width: '350px', position: 'absolute', clip: 'rect(40px,290px,170px,30px)' }}
          />
        )
        }
      </div >
    );
  }

  function NewsList() {
    const [news, setNews] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    var newsRes;
    console.log('useEffect news run ');
    useEffect(() => {
      if (isNewsMounted) {
        AuthService.crawlGet().then(
          (res) => {
            newsRes = res;
            const processedNews = {};
            Object.keys(res).forEach((title, index) => {
              if (index >= 3) return; // 只需要Top3
              processedNews[title] = res[title];
            });
            setNews(processedNews);
            setIsLoading(false);
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
          }
        )
      };
      return () => {
        if (newsRes !== undefined)
          setNewsMounted(false);
      };
    }, [isNewsMounted]);

    return (
      <div className="info_three_news">
        <div className="info_subtitle">最近新聞連結</div>
        {isLoading ? (
          <span className="info_two_square_text_content" style={{ bottom: '26%', left: '81%', position: 'absolute' }}> Loading...</span>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              flexDirection: "column",
              height: "150px",
              marginLeft: "1rem",
            }}
          >
            {Object.keys(news).map((title, index) => (
              <div key={index}>
                <span className="news_top">Top {index + 1}</span>
                <div className="news_url">
                  <a href={news[title]}>{title}</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }


  const MoodChart = () => {
    const eChartsRef = useRef(null);
    const [sentiment, setSentiment] = useState(0);
    var tempSenti;
    useEffect(() => {
      console.log('useEffect sentiment run ');

      AuthService.sentimentGet().then(
        (res) => {
          console.log(res);
          tempSenti = res;
          if (typeof res === 'number') {
            res = res.toFixed(0);
          }
          setSentiment(res);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      )
    }, []);

    useEffect(() => {

      const myChart = eCharts.init(eChartsRef.current);

      let option = {
        series: [
          {
            type: 'gauge',
            center: ['60%', '50%'],
            radius: '90%',
            startAngle: 180,
            endAngle: 0,
            min: -100,
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
                value: sentiment
              }
            ]
          }
        ]
      };

      myChart.setOption(option);

    }, [sentiment]);

    return (
      <div>
        <div ref={eChartsRef} style={{
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
      </div>
    );
  }

  return (

    <>
      <div className="info_two">
        <div className="info_title">回測</div>
        <div className="info_two_square">
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">年複成長率</span>
            <span className="info_two_square_text_content">{cagr}</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">最大交易回落</span>
            <span className="info_two_square_text_content">{max_drawdown}</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">波動率</span>
            <span className="info_two_square_text_content">{volatility}</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">夏普比率</span>
            <span className="info_two_square_text_content">{sharpe_ratio}</span>
          </div>
          <div className="info_two_square_text">
            <span className="info_two_square_text_title">贏率</span>
            <span className="info_two_square_text_content">{win_rate}</span>
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
          <WordCloud />
          <NewsList />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="button_group" >
          <button className="info_back_button" onClick={() => navigate('/Strategy')}>
            <span>重新回測</span>
          </button>
          <button className="info_next_button" onClick={() => navigate('/Transaction', {
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
      </div>
    </>


  );

}
export default InfoSquare;