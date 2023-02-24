from flask_restful import Resource
from flask import request
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode
from Module.Trade import Trade


class TradeController(Resource):
    def __init__(self):
        self._tradeMemberConnection = MongoConnector().getTradeMemberConn()

    def get(self):
        '''
        Get a member's working strategy.
        Data json: user
        '''
        data = request.get_json()
        user = data['email']
        strategy = self._tradeMemberConnection.find({'email': user})
        return strategy, ResponseCode.SUCCESS if strategy else ResponseCode.MEMBER_NOT_EXIST
    
    def post(self):
        '''
        Implement the strategy to the exchange. Send info to MongoDB.
        Data json: email, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy
        '''
        data = request.get_json()
        email = data['email']
        exchange = data['exchange']
        if exchange == 'Binance':
            api_key = data['api_key']
            api_secret = data['api_secret']
            pass_phrase = ''
        elif exchange == 'OKX':
            api_key = data['api_key']
            api_secret = data['api_secret']
            pass_phrase = data['pass_phrase']
        symbol = data['symbol']
        money = data['money']
        timeframe = data['timeframe']
        strategy = data['strategy']

        id = self._tradeMemberConnection.count_documents({}) + 1
        trade = {
            'id': id,
            'email': email,
            'exchange': exchange,
            'api_key': api_key,
            'api_secret': api_secret,
            'pass_phrase': pass_phrase,
            'symbol': symbol,
            'money': money,
            'timeframe': timeframe,
            'strategy': strategy,
            'has_position': '0',
        }
        result = self._tradeMemberConnection.insert_one(trade)
        return ResponseCode.SUCCESS if result else ResponseCode.BAD_REQUEST
    
    def put(self):
        '''
        Update the strategy. Send info to MongoDB.
        Data json: id, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy
        '''
        data = request.get_json()
        id = data['id']
        exchange = data['exchange']
        if exchange == 'Binance':
            api_key = data['api_key']
            api_secret = data['api_secret']
            pass_phrase = ''
        elif exchange == 'OKX':
            api_key = data['api_key']
            api_secret = data['api_secret']
            pass_phrase = data['pass_phrase']
        symbol = data['symbol']
        money = data['money']
        timeframe = data['timeframe']
        strategy = data['strategy']
        
        trade = {
            'exchange': exchange,
            'api_key': api_key,
            'api_secret': api_secret,
            'pass_phrase': pass_phrase,
            'symbol': symbol,
            'money': money,
            'timeframe': timeframe,
            'strategy': strategy,
        }
        result = self._tradeMemberConnection.update_one({'id': id}, {'$set': trade})
        return ResponseCode.SUCCESS if result else ResponseCode.BAD_REQUEST

    def delete(self):
        '''
        Delete the strategy. Send info to MongoDB.
        Data json: id
        '''
        data = request.get_json()
        id = data['id']
        result = self._tradeMemberConnection.delete_one({'id': id})
        return ResponseCode.SUCCESS if result else ResponseCode.BAD_REQUEST

class TradeTransactionController(Resource):
    def __init__(self):
        self._tradeTransactionConnection = MongoConnector().getTradeTransactionConn()

    def get(self):
        data = request.get_json()
        email = data['email']
        result = self._tradeTransactionConnection.find({'email': email})
        return result, ResponseCode.SUCCESS if result else ResponseCode.MEMBER_NOT_EXIST
