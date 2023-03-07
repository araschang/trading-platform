import pandas as pd
import numpy as np
import ccxt
from datetime import datetime, timedelta
from Module.Indicators import *
from Base.ConfigReader import Config
from Base.JsonParser import JsonParser

class Connector(object):
    def __init__(self):
        self.config = Config()


class Backtest(Connector):
    def __init__(self, symbol, timeframe, backtest_range):
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
        if self.backtest_range == '1mon':
            self.start = int(datetime.timestamp(datetime.now() - timedelta(days=30))) * 1000
        elif self.backtest_range == '3mon':
            self.start = datetime.timestamp(datetime.now() - timedelta(days=90)) * 1000
        elif self.backtest_range == '6mon':
            self.start = datetime.timestamp(datetime.now() - timedelta(days=180)) * 1000
    
    def Backtest(self, symbol, timeframe, strategy):
        self.symbol = symbol
        self.timeframe = timeframe
        self.strategy = strategy
        self.df = self.get_ohlcv()
        self.df = self.add_strategy(self.df, self.strategy)
        self.df = self.run(self.df, self.strategy)
        self.result, self.df = self.get_results(self.df, self.timeframe)
        return self.result, self.df

    def get_ohlcv(self):
        '''Get a year OHLCV data from the exchange'''
        ohlcv = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, since=self.start)
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
        if df.iloc[which_day]['MACD'] > df.iloc[which_day]['MACD_signal'] and df.iloc[which_day-1]['MACD'] < df.iloc[which_day-1]['MACD_signal']:
            return 'buy'
        elif df.iloc[which_day]['MACD'] < df.iloc[which_day]['MACD_signal'] and df.iloc[which_day-1]['MACD'] > df.iloc[which_day-1]['MACD_signal']:
            return 'sell'
        else:
            return ''

    def kd_signal(self, df, which_day: int):
        '''Generate ATR signal'''
        if df.iloc[which_day]['K'] > df.iloc[which_day]['D'] and df.iloc[which_day-1]['K'] < df.iloc[which_day-1]['D']:
            return 'buy'
        elif df.iloc[which_day]['K'] < df.iloc[which_day]['D'] and df.iloc[which_day-1]['K'] > df.iloc[which_day-1]['D']:
            return 'sell'
        else:
            return ''

    def ema_signal(self, df, which_day: int):
        '''Generate EMA signal'''
        if df.iloc[which_day]['EMA_short'] > df.iloc[which_day]['EMA_long'] and df.iloc[which_day-1]['EMA_short'] < df.iloc[which_day-1]['EMA_long']:
            return 'buy'
        elif df.iloc[which_day]['EMA_short'] < df.iloc[which_day]['EMA_long'] and df.iloc[which_day-1]['EMA_short'] > df.iloc[which_day-1]['EMA_long']:
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
        df['pnl'] = 0
        df['signal'] = ''
        signal = ''
        for i in range(1, len(df)):
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
                df.loc[i, 'pnl'] = (exit_price - entry_price) / entry_price
            elif signal == 'sell' and trade_signal == 'buy':
                signal = ''
                df.loc[i, 'signal'] = 'buy'
                exit_price = df.loc[i, 'close']
                df.loc[i, 'pnl'] = (entry_price - exit_price) / entry_price
            else:
                df.loc[i, 'signal'] = signal
        return df

    def convert_timeframe_to_year(self, df, timeframe: str):
        '''Convert the timeframe to year'''
        if timeframe == '1d':
            return len(df) / 365
        elif timeframe == '1h':
            return len(df) / 365 / 24
        elif timeframe == '30m':
            return len(df) / 365 / 24 / 2
        elif timeframe == '15m':
            return len(df) / 365 / 24 / 4
        elif timeframe == '5m':
            return len(df) / 365 / 24 / 12
        elif timeframe == '1m':
            return len(df) / 365 / 24 / 60

    def get_results(self, df, timeframe: str):
        '''
        Get the results of the backtest. A dict and a dataframe
        Return:
            results: dict (cagr, max_drawdown, volatility, sharpe_ratio, win_rate)
            df: dataframe

        '''
        df['pnl'] = df['pnl'].fillna(0)
        df['cum_pnl'] = np.cumsum(df['pnl'])
        df['cum_pnl'] = df['cum_pnl'].fillna(0)
        df['cum_pnl'] = df['cum_pnl'] + 1
        df['cum_pnl'] = df['cum_pnl'].cumprod()
        df['cum_pnl'] = df['cum_pnl'].fillna(1)
        df['cum_pnl'] = df['cum_pnl'] - 1
        df['cum_pnl'] = df['cum_pnl'] * 100
        df['cum_pnl'] = df['cum_pnl'].round(2)
        cagr = np.sign(df['cum_pnl'].iloc[-1] / 100) * np.power(np.abs(df['cum_pnl'].iloc[-1] / 100), 1 / self.convert_timeframe_to_year(df, timeframe)) - 1
        cagr = cagr * 100
        cagr = cagr.round(2)
        df['max_drawdown'] = df['cum_pnl'].cummax() - df['cum_pnl']
        df['max_drawdown'] = df['max_drawdown'].fillna(0)
        pnl = round(df['pnl'].sum(), 2)
        max_drawdown = float(df['max_drawdown'].max())
        max_drawdown = round(max_drawdown, 2)
        volatility = df['pnl'].std()
        volatility = volatility * np.sqrt(365)
        volatility = volatility * 100
        volatility = volatility.round(2)
        sharpe_ratio = cagr / volatility
        sharpe_ratio = sharpe_ratio.round(2)
        results = {
            "cagr": cagr,
            "pnl": pnl,
            "max_drawdown": max_drawdown,
            "volatility": volatility,
            "sharpe_ratio": sharpe_ratio
        }
        return results, df

if __name__ == '__main__':
    backtest = Backtest('Binance', 'BTC/USDT', '1h')
    df = backtest.get_ohlcv()
    print(df)
