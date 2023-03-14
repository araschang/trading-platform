import React, { useState, useRef, PureComponent, useEffect } from "react";
import InfoSquare from "./InfoSquare";
import MultiStepProgressBar from './ThreeProgressBar'
import { useNavigate, useLocation } from "react-router-dom";
import * as eCharts from "echarts";
import moment from 'moment';
import AlreadyLoginHeader from "../AlreadyLoginHeader"
import AuthService from "../../services/auth.service";
import "./css/InfoPage.css"
import "./css/InfoSquare.css"
function InfoPage() {

  const { state } = useLocation();
  console.log(state.exchange);
  const email = AuthService.getCurrentUserEmail();
  const exchange = state.exchange;
  const symbol = state.symbol;
  const strategy = state.strategy;
  const timeframe = state.timeframe;
  const backtest = JSON.parse(state.backtest);

  const time = [];
  const cum_ret_format = [];
  const close = [];
  const volume = [];

  backtest.forEach((item) => {
    const tempDate = new Date(item.time).toISOString();
    time.push(tempDate);
    cum_ret_format.push([tempDate, item.cum_ret_format]);
    close.push([tempDate, item.close]);
    volume.push([tempDate, item.volume]);
  });

  const IncomeChart = () => {
    const eChartsRef = useRef();

    useEffect(() => {
      const myChart = eCharts.init(eChartsRef.current);
      const option = {
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
            interval:0,  
    rotate:40,  
            formatter: (value) => moment(value).format('DD:HH:mm')
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
            bottom:'15%'
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        grid: {
          top: "15%",
          right: '20%',
          left:'5%',
          containLabel: true,
        },
        color: '#677BF6',
        series: [
          {
            data: cum_ret_format,
            type: 'line'
          }
        ]
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }, []);

    return (
      <div
        ref={eChartsRef}
        style={{
          width: 530,
          height: 320,
        }}
      />
    );
  };


  const PriceChart = () => {
    const eChartsRef = useRef(null);

    useEffect(() => {
      const myChart = eCharts.init(eChartsRef.current);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["價格", "交易量"],
          top: "5%",
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          axisLabel: {
            interval:0,  
    rotate:40,  
            formatter: (value) => {
              return moment(value).format("DD:HH:mm");
            },
          },
          nameTextStyle: {
            width: '1em',
            overflow: 'truncate',
            fontSize: 10
          }
        },
        yAxis: [
          {
            type: "value",
            name: "交易量",
            position: "right",
            alignTicks: true,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: "{value} ",
            },
          },
          {
            type: "value",
            name: "價格",
            position: "left",
            alignTicks: true,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: "{value} 元",
            },
          },
        ],
        grid: {
          top: "20%",
          containLabel: true,
          right: '5%',
          left: '2%'
        },
        color: ["#F2C94C", "#F2994A"],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
            height: "5%",
            bottom:'15%'
          },
          {
            type: "inside",
            start: 0,
            end: 100,
          }
        ],
        series: [
          {
            name: "交易量",
            type: "line",
            data: volume,
          },
          {
            name: "價格",
            type: "line",
            yAxisIndex: 1,
            data: close,
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }, []);

    return (
      <div
        ref={eChartsRef}
        style={{
          width: 530,
          height: 320,
          marginLeft: 10,
        }}
      ></div>
    );
  };


  return (
    <div>
      <AlreadyLoginHeader />
      {/* 進度條 */}
      <div style={{
        position: 'absolute',
        width: '674px',
        height: '61px',
        left: '23%',
        top: '15%'
      }}><MultiStepProgressBar /></div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'absolute',
          top: '120%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
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
          <InfoSquare />
        </div>

      </div>
    </div>
  );
}

export default InfoPage;
