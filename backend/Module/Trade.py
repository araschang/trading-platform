import ccxt
import pandas as pd
from datetime import datetime, timedelta
from Base.ConfigReader import Config
from Base.Connector import MongoConnector
from Base.JsonParser import JsonParser
from Module.Indicators import *


class Trade(object):
    def __init__(self, id, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy):
        super().__init__()
        self._tradeMemberConnection = MongoConnector().getTradeMemberConn()
        self._tradeTransactionConnection = MongoConnector().getTradeTransactionConn()

        if exchange == 'Binance':
            self.exchange = ccxt.binanceusdm({
                'apiKey': api_key,
                'secret': api_secret,
                'enableRateLimit': True,
                'option': {
                    'defaultMarket': 'future',
                },
            })
        elif exchange == 'OKX':
            self.exchange = ccxt.okx({
                'apiKey': api_key,
                'secret': api_secret,
                'password': pass_phrase,
            })
        self.id = id
        self.money = money
        self.symbol = symbol
        self.timeframe = timeframe
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
    
    def Trade(self):
        self.df = self.get_ohlcv()
        self.df = self.add_strategy(self.df, self.strategy)
        self.strategy = JsonParser.parse_strategies(self.strategy)
        indicators = []
        for strategy in self.strategy:
            indicators.append(strategy[0])
        signal = self.check_trade(self.df, len(self.df)-1, indicators)
        has_position = self.check_if_position_exist()
        if signal == 'buy' and not has_position:
            self.open_position('buy')
        elif signal == 'sell' and has_position:
            self.close_position('sell')
        elif signal == 'sell' and not has_position:
            self.open_position('sell')
        elif signal == 'buy' and has_position:
            self.close_position('buy')
        # check if the member is already have a position
        # if not, create a new position
        return signal
    
    def check_if_position_exist(self):
        result = self._tradeMemberConnection.find_one({'id': self.id})
        result['has_position'] = int(result['has_position'])
        if result['has_position'] == 1:
            return True
        else:
            return False
        
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
        if df.iloc[which_day]['MACD'] > df.iloc[which_day]['MACD_signal'] and df.iloc[which_day-1]['MACD'] < df.iloc[which_day-1]['MACD_signal']:
            return 'buy'
        elif df.iloc[which_day]['MACD'] < df.iloc[which_day]['MACD_signal'] and df.iloc[which_day-1]['MACD'] > df.iloc[which_day-1]['MACD_signal']:
            return 'sell'
        else:
            return ''

    def kd_signal(self, df, which_day: int):
        '''Generate KD signal'''
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
    
    def open_position(self, side):
        '''
        Open a new position, side='buy' or 'sell'
        '''
        # get the current price
        current_price = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, limit=1)
        current_price = pd.DataFrame(current_price, columns=['time', 'open', 'high', 'low', 'close', 'volume'])
        current_price = current_price.iloc[0]['close']

        # calculate the amount of the position
        amount = float(self.money) / current_price

        # open the position
        self.exchange.create_order(self.symbol, 'market', side, amount)

        # update the position to the database
        id = self._tradeTransactionConnection.count_documents({}) + 1
        transaction_data = {
            'id': id,
            'strategy_id': self.id,
            'symbol': self.symbol,
            'side': side,
            'open_price': current_price,
            'open_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'close_price': -1,
            'close_time': -1,
            'amount': amount,
            'profit': -1,
        }
        self._tradeTransactionConnection.insert_one(transaction_data)

        member_data = {
            'has_position': '1',
        }
        self._tradeMemberConnection.update_one({'id': self.id}, {'$set': member_data})
    
    def close_position(self, side):
        transaction_data = self._tradeTransactionConnection.find_one({'strategy_id': self.id, 'close_price': -1})
        amount = transaction_data['amount']
        self.exchange.create_order(self.symbol, 'market', side, amount)

        # update the position to the database
        current_price = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, limit=1)
        current_price = pd.DataFrame(current_price, columns=['time', 'open', 'high', 'low', 'close', 'volume'])
        current_price = current_price.iloc[0]['close']
        if side == 'buy':
            profit = (current_price - transaction_data['open_price']) * amount
        elif side == 'sell':
            profit = (transaction_data['open_price'] - current_price) * amount
        
        transaction_data = {
            'close_price': current_price,
            'close_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'profit': profit,
        }
        self._tradeTransactionConnection.update_one({'strategy_id': self.id, 'close_price': -1}, {'$set': transaction_data})
        
        member_data = {
            'has_position': '0',
        }
        self._tradeMemberConnection.update_one({'id': self.id}, {'$set': member_data})

if __name__ == '__main__':
    exchange = "Binance"
    api_key = "Af245tCHxHvrKWOqrzA2T8lUPRNjlkuIPZqq9SnzrltBxdFZ7jJhigTLVEbQX70d"
    api_secret = "7mMylwUxLaIt8MaSzeoRUltOSdNDS2CT9pheQaPpPeoldNjL6pveeu6DPAXQKZVB"
    pass_phrase = ""
    symbol = "BTC/USDT"
    money = "15"
    timeframe =  "1h"
    stratege = [{"KD":{"period": "14"}}, {"MACD":{"fast":"7", "slow":"26", "signal": "10"}}, {"EMA":{"ema_short_len":"20", "ema_long_len":"50"}}]
    trade = Trade(1, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, stratege)
    trade.Trade()


