import sys
sys.path.append('./backend')
import pandas as pd
import numpy as np
import ccxt
import warnings
warnings.filterwarnings('ignore')
from datetime import datetime, timedelta
from Module.Indicators import *
from Base.ConfigReader import Config
from Base.JsonParser import JsonParser

class Connector(object):
    def __init__(self):
        self.config = Config()


class Backtest(Connector):
    def __init__(self, symbol, timeframe, backtest_range, strategy):
        super().__init__()
        config = self.config['Binance']
        self.exchange = ccxt.binanceusdm({
            'apiKey': config['api_key'],
            'secret': config['api_secret'],
            'enableRateLimit': True,
            'option': {
                'defaultMarket': 'future',
            },
        })
        self.symbol = symbol
        self.timeframe = timeframe
        self.backtest_range = backtest_range
        self.strategy = strategy
        if self.timeframe == '1m': # 抓一天資料強制回測一天
            self.start = int(datetime.timestamp(datetime.now() - timedelta(days=1))) * 1000
        elif self.timeframe == '5m': # 抓五天資料強制回測三天
            self.start = int(datetime.timestamp(datetime.now() - timedelta(days=5))) * 1000
        elif self.timeframe == '1h': # 抓兩個月資料強制回測一個月
            self.start = int(datetime.timestamp(datetime.now() - timedelta(days=60))) * 1000
        elif self.timeframe == '4h': # 自由選擇回測區間
            self.start = int(datetime.timestamp(datetime.now() - timedelta(days=250))) * 1000
        elif self.timeframe == '1d': # 自由選擇回測區間
            self.start = int(datetime.timestamp(datetime.now() - timedelta(days=1000))) * 1000
    
    def Backtest(self):
        self.df = self.get_ohlcv()
        self.df = self.add_strategy(self.df, self.strategy)
        self.df = self.run(self.df, self.strategy)
        self.df = self.format_df_to_plot(self.df)
        self.result, self.df = self.get_results(self.df)
        return self.result, self.df

    def get_ohlcv(self):
        '''Get a year OHLCV data from the exchange'''
        ohlcv = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, since=self.start, limit=3000)
        df = pd.DataFrame(ohlcv, columns=['time', 'open', 'high', 'low', 'close', 'volume'])
        df['time'] = pd.to_datetime(df['time'], unit='ms')
        return df

    def add_strategy(self, df, strategies):
        '''
        Add indicators to the OHLCV dataframe
        Avalible strategies: MACD, EMA, KD
        '''
        check_strategies = JsonParser.parse_strategies(strategies)
        for strategy in check_strategies:
            if 'KD' == strategy[0]:
                temp = KD(df, strategy[1])
                df['K'] = temp['K']
                df['D'] = temp['D']
            elif 'MACD' == strategy[0]:
                temp = MACD(df, strategy[1], strategy[2], strategy[3])
                df['MACD'] = temp['MACD']
                df['MACD_signal'] = temp['signal']
            elif 'EMA' == strategy[0]:
                df['EMA_short'] = EMA(df, strategy[1])
                df['EMA_long'] = EMA(df, strategy[2])   
        df.dropna(inplace=True)
        df.reset_index(drop=True, inplace=True)
        return df

    def macd_signal(self, df, which_day: int):
        '''Generate MACD signal'''
        if df.iloc[which_day]['MACD'] > df.iloc[which_day]['MACD_signal']:
            return 'buy'
        elif df.iloc[which_day]['MACD'] < df.iloc[which_day]['MACD_signal']:
            return 'sell'
        else:
            return ''

    def kd_signal(self, df, which_day: int):
        '''Generate ATR signal'''
        if df.iloc[which_day]['K'] > df.iloc[which_day]['D']:
            return 'buy'
        elif df.iloc[which_day]['K'] < df.iloc[which_day]['D']:
            return 'sell'
        else:
            return ''

    def ema_signal(self, df, which_day: int):
        '''Generate EMA signal'''
        if df.iloc[which_day]['EMA_short'] > df.iloc[which_day]['EMA_long']:
            return 'buy'
        elif df.iloc[which_day]['EMA_short'] < df.iloc[which_day]['EMA_long']:
            return 'sell'
        else:
            return ''

    def check_trade(self, df, which_day: int, indicators: list):
        '''Check if there is a trade signal'''
        signal_list = []
        for indicator in indicators:
            if indicator == 'KD':
                signal = self.kd_signal(df, which_day)
            elif indicator == 'MACD':
                signal = self.macd_signal(df, which_day)
            elif indicator == 'EMA':
                signal = self.ema_signal(df, which_day)
            signal_list.append(signal)
        if signal_list.count('buy') == len(indicators):
            return 'buy'
        elif signal_list.count('sell') == len(indicators):
            return 'sell'
        else:
            return ''

    def run(self, df, strategies):
        '''Run the backtest'''
        strategiy_list = JsonParser.parse_strategies(strategies)
        indicators = []
        for strategy in strategiy_list:
            indicators.append(strategy[0])
        cum_ret = 1
        df['ret'] = 0
        df['cum_ret'] = 0
        df['signal'] = ''
        signal = ''
        if self.timeframe == '1m': # 1d
            range_from = 0
        elif self.timeframe == '5m': # 5d
            range_from = len(df) - (1442 - 575)
        elif self.timeframe == '1h': # 1mon
            range_from = len(df) - (1439 - 767)
        elif self.timeframe == '4h':
            if self.backtest_range == '1mon':
                range_from = len(df) - (1499 - 1331)
            elif self.backtest_range == '3mon':
                range_from = len(df) - (1499 - 959)
            elif self.backtest_range == '6mon':
                range_from = len(df) - (1499 - 413)
        elif self.timeframe == '1d':
            if self.backtest_range == '1mon':
                range_from = len(df) - 30
            elif self.backtest_range == '3mon':
                range_from = len(df) - 90
            elif self.backtest_range == '6mon':
                range_from = len(df) - 180
        
        for i in range(range_from, len(df)):
            trade_signal = self.check_trade(df, i, indicators)
            if signal == '' and trade_signal == 'buy':
                signal = 'buy'
                df.loc[i, 'signal'] = 'buy'
                entry_price = df.loc[i, 'close']
            elif signal == '' and trade_signal == 'sell':
                signal = 'sell'
                df.loc[i, 'signal'] = 'sell'
                entry_price = df.loc[i, 'close']
            elif signal == 'buy' and trade_signal == 'sell':
                signal = ''
                df.loc[i, 'signal'] = 'sell'
                exit_price = df.loc[i, 'close']
                df.loc[i, 'ret'] = (exit_price - entry_price) / entry_price
                cum_ret = cum_ret * (1 + df.loc[i, 'ret'])
                df.loc[i, 'cum_ret'] = cum_ret
            elif signal == 'sell' and trade_signal == 'buy':
                signal = ''
                df.loc[i, 'signal'] = 'buy'
                exit_price = df.loc[i, 'close']
                df.loc[i, 'ret'] = (entry_price - exit_price) / entry_price
                cum_ret = cum_ret * (1 + df.loc[i, 'ret'])
                df.loc[i, 'cum_ret'] = cum_ret
            else:
                df.loc[i, 'signal'] = signal
        df = df.loc[range_from: , :]
        df.reset_index(drop=True, inplace=True)
        return df
    
    def format_df_to_plot(self, df):
        df['cum_ret_format'] = df['cum_ret'] - 1
        df['cum_ret_format'][df['cum_ret_format'] == -1] = 0
        unzero_list = list(df[df['cum_ret_format'] != 0].index.values)
        unzero_list.append(len(df))
        for i in range(len(unzero_list)-1):
            for j in range(unzero_list[i], unzero_list[i+1]):
                df['cum_ret_format'][j] = df['cum_ret_format'][unzero_list[i]]
        return df

    def get_results(self, df):
        '''
        Get the results of the backtest. A dict and a dataframe
        Return:
            results: dict (cagr, max_drawdown, volatility, sharpe_ratio, win_rate)
            df: dataframe

        '''
        cagr = CAGR(df,self.timeframe, self.backtest_range)
        pnl = float(df['ret'].sum())
        max_drawdown = max_dd(df)
        vol = volatility(df)
        if vol == 0:
            sharpe_ratio = 'NaN'
        else:
            sharpe_ratio = sharpe(df, 0.0398, self.timeframe, self.backtest_range)

        transactions = len(df[df['ret'] != 0])
        win = len(df[df['ret'] > 0])
        if transactions == 0:
            winrate = 'NaN'
        else:
            winrate = win / transactions
        results = {
            "cagr": cagr,
            "pnl": pnl,
            "max_drawdown": max_drawdown,
            "volatility": vol,
            "sharpe_ratio": sharpe_ratio,
            "win_rate": winrate
        }
        return results, df

if __name__ == '__main__':
    strategy = [{"KD":{"period": "14"}}, {"MACD":{"fast":"7", "slow":"26", "signal": "10"}}, {"EMA":{"ema_short_len":"20", "ema_long_len":"50"}}]
    backtest = Backtest('BTC/USDT', '1d', '1mon', strategy)
    result, df = backtest.Backtest()
    # df.to_csv('result.csv')
    print(result)
