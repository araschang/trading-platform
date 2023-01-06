import ccxt
import pandas as pd
from datetime import datetime, timedelta
from Base.ConfigReader import Config
from Base.JsonParser import JsonParser
from Module.Backtest import Backtest
from Module.Indicators import *

class Connector(object):
    def __init__(self):
        self.config = Config()

class Trade(Connector):
    def __init__(self, exchange, symbol, timeframe):
        super().__init__()
        if exchange == 'Binance':
            config = self.config['Binance']
            self.exchange = ccxt.binanceusdm({
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
    
    def Trade(self, symbol, timeframe, strategy, amount):
        self.symbol = symbol
        self.timeframe = timeframe
        self.strategy = strategy
        self.amount = amount
        self.df = self.get_ohlcv(self.start, self.end)
        self.df = self.add_strategy(self.df, self.strategy)
        self.signal = self.check_trade(self.df, self.strategy)
        return self.signal
    
    def get_ohlcv(self, start, end):
        '''Get a year OHLCV data from the exchange'''
        ohlcv = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, start, end)
        df = pd.DataFrame(ohlcv, columns=['time', 'open', 'high', 'low', 'close', 'volume'])
        df['time'] = pd.to_datetime(df['time'], unit='ms')
        return df
    
    def add_strategy(self, df, strategies):
        '''Add strategy to the dataframe'''
        check_strategies = JsonParser.parse_strategies(strategies)
        for strategy in check_strategies:
            if 'ATR' == strategy[0]:
                df['ATR'] = ATR(df, strategy[1])
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

    def check_trade(self, df, indicators: list):
        '''Check if there is a trade signal'''
        signal_list = []
        for indicator in indicators:
            if indicator == 'ATR':
                signal = self.atr_signal(df)
            elif indicator == 'MACD':
                signal = self.macd_signal(df)
            elif indicator == 'EMA':
                signal = self.ema_signal(df)
            signal_list.append(signal)
        if signal_list.count('buy') == len(indicators):
            return 'buy'
        elif signal_list.count('sell') == len(indicators):
            return 'sell'
        else:
            return ''
    
    def macd_signal(self, df):
        '''Generate MACD signal'''
        if df.iloc[-1]['MACD'] > df.iloc[-1]['MACD_signal'] and df.iloc[-2]['MACD'] < df.iloc[-2]['MACD_signal']:
            return 'buy'
        elif df.iloc[-1]['MACD'] < df.iloc[-1]['MACD_signal'] and df.iloc[-2]['MACD'] > df.iloc[-2]['MACD_signal']:
            return 'sell'
        else:
            return ''
    
    def atr_signal(self, df):
        '''Generate ATR signal'''
        if df.iloc[-1]['ATR'] > df.iloc[-2]['ATR']:
            return 'buy'
        elif df.iloc[-1]['ATR'] < df.iloc[-2]['ATR']:
            return 'sell'
        else:
            return ''
    
    def ema_signal(self, df):
        '''Generate EMA signal'''
        if df.iloc[-1]['EMA_short'] > df.iloc[-1]['EMA_long'] and df.iloc[-2]['EMA_short'] < df.iloc[-2]['EMA_long']:
            return 'buy'
        elif df.iloc[-1]['EMA_short'] < df.iloc[-1]['EMA_long'] and df.iloc[-2]['EMA_short'] > df.iloc[-2]['EMA_long']:
            return 'sell'
        else:
            return ''
    
    def get_position(self):
        '''Get current position'''
        position = self.exchange.fetch_position(self.symbol)
        return position
    
    def get_balance(self):
        '''Get current balance'''
        balance = self.exchange.fetch_balance()
        return balance
    
    def get_order(self, order_id):
        '''Get order status'''
        order = self.exchange.fetch_order(order_id)
        return order

    def place_order(self, side, price, amount):
        '''Place an order'''
        order = self.exchange.create_order(self.symbol, 'market', side, amount)
        return order
    
    def close_position(self):
        '''Close current position'''
        position = self.get_position()
        if position['side'] == 'buy':
            side = 'sell'
        elif position['side'] == 'sell':
            side = 'buy'
        amount = position['amount']
        order = self.place_order(side, None, amount)
        return order
