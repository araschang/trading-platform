import pandas as pd
import numpy as np
import ccxt
from datetime import datetime, timedelta
from Module.Indicators import *
from Base.ConfigReader import Config

class Connector(object):
    def __init__(self):
        self.config = Config()


class Backtest(Connector):
    def __init__(self, exchange, symbol, timeframe):
        super().__init__()
        if exchange == 'Binance':
            config = self.config['Binance']
            self.exchange = binance = ccxt.binanceusdm({
                'apiKey': config['api_key'],
                'secret': config['api_secret'],
                'enableRateLimit': True,
                'option': {
                    'defaultMarket': 'future',
                },
            })
        elif exchange == 'OKX':
            config = self.config['OKX']
            self.exchange = ccxt.okx({
                'apiKey': config['api_key'],
                'secret': config['api_secret'],
                'password': config['pass_phrase'],
            })
        ### Add more exchanges here
        self.symbol = symbol
        self.timeframe = timeframe
        self.start = datetime.timestamp(datetime.now() - timedelta(days=365))
        self.end = datetime.timestamp(datetime.now())
    
    def get_ohlcv(self):
        '''Get a year OHLCV data from the exchange'''
        ohlcv = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, self.start, self.end)
        df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        ohlcv = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, self.start, self.end)
        df = pd.DataFrame(ohlcv, columns=['time', 'open', 'high', 'low', 'close', 'volume'])
        df['time'] = pd.to_datetime(df['time'], unit='ms')
        return df
    
    def add_strategy(self, df, strategies: list, atr_period=14, fast=12, slow=26, signal=9, ema_short_len=20, ema_long_len=50):
        '''
        Add indicators to the OHLCV dataframe
        Avalible strategies: ATR, MACD, EMA
        '''
        for strategy in strategies:
            if strategy == 'ATR':
                df['ATR'] = ATR(df, atr_period=atr_period)
            elif strategy == 'MACD':
                df['MACD'], df['MACD_signal'] = MACD(df, fast=fast, slow=slow, signal=signal)
            elif strategy == 'EMA':
                df['EMA_short'] = EMA(df, ema_short_len=ema_short_len)
                df['EMA_long'] = EMA(df, ema_long_len=ema_long_len)
        df.dropna(inplace=True)
        return df
    
    def macd_signal(self, df, which_day: int):
        '''Generate MACD signal'''
        if df.iloc[which_day]['MACD'] > df.iloc[which_day]['MACD_signal'] and df.iloc[which_day-1]['MACD'] < df.iloc[which_day-1]['MACD_signal']:
            return 'buy'
        elif df.iloc[which_day]['MACD'] < df.iloc[which_day]['MACD_signal'] and df.iloc[which_day-1]['MACD'] > df.iloc[which_day-1]['MACD_signal']:
            return 'sell'
        else:
            return ''
    
    def atr_signal(self, df, which_day: int):
        '''Generate ATR signal'''
        if df.iloc[which_day]['close'] > df.iloc[which_day]['ATR'] and df.iloc[which_day-1]['close'] < df.iloc[which_day-1]['ATR']:
            return 'buy'
        elif df.iloc[which_day]['close'] < df.iloc[which_day]['ATR'] and df.iloc[which_day-1]['close'] > df.iloc[which_day-1]['ATR']:
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
            if indicator == 'ATR':
                signal = self.atr_signal(df, which_day)
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
    
    def run(self, df, indicators: list):
        '''Run the backtest'''
        signal = ''
        for i in range(1, len(df)):
            trade_signal = self.check_trade(df, i, indicators)
            if signal == '' and trade_signal == 'buy':
                signal = 'buy'
                df.loc[i, 'signal'] = 'buy'
                df.loc[i, 'entry_price'] = df.loc[i, 'close']
            elif signal == '' and trade_signal == 'sell':
                signal = 'sell'
                df.loc[i, 'signal'] = 'sell'
                df.loc[i, 'entry_price'] = df.loc[i, 'close']
            elif signal == 'buy' and trade_signal == 'sell':
                signal = ''
                df.loc[i, 'signal'] = 'sell'
                df.loc[i, 'exit_price'] = df.loc[i, 'close']
                df.loc[i, 'pnl'] = (df.loc[i, 'exit_price'] - df.loc[i, 'entry_price']) / df.loc[i, 'entry_price']
            elif signal == 'sell' and trade_signal == 'buy':
                signal = ''
                df.loc[i, 'signal'] = 'buy'
                df.loc[i, 'exit_price'] = df.loc[i, 'close']
                df.loc[i, 'pnl'] = (df.loc[i, 'entry_price'] - df.loc[i, 'exit_price']) / df.loc[i, 'entry_price']
            else:
                df.loc[i, 'signal'] = signal
        return df
    
    def get_results(self, df):
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
        cagr = (df['cum_pnl'].iloc[-1] / 100) ** (365 / len(df)) - 1
        cagr = cagr * 100
        cagr = cagr.round(2)
        df['max_drawdown'] = df['cum_pnl'].cummax() - df['cum_pnl']
        df['max_drawdown'] = df['max_drawdown'].fillna(0)
        max_drawdown = df['max_drawdown'].max()
        max_drawdown = max_drawdown.round(2)
        volatility = df['pnl'].std()
        volatility = volatility * np.sqrt(365)
        volatility = volatility * 100
        volatility = volatility.round(2)
        sharpe_ratio = cagr / volatility
        sharpe_ratio = sharpe_ratio.round(2)
        winrate = len(df[df['pnl'] > 0]) / len(df[df['pnl'] != 0])
        results = {
            'cagr': cagr,
            'max_drawdown': max_drawdown,
            'volatility': volatility,
            'sharpe_ratio': sharpe_ratio,
            'winrate': winrate,
        }
        return results, df
    