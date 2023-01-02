import ccxt
from datetime import datetime, timedelta
from Base.ConfigReader import Config

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
