from flask_restful import Resource
from flask import request
from rq import Queue
from Base.Connector import RedisConnector, MongoConnector
from Base.ResponseCode import ResponseCode
from Module.Trade import Trade


class TradeController(Resource):
    def __init__(self):
        self.redis_conn = RedisConnector().getConn()
        self.mongo_conn = MongoConnector().getConn()
    
    def post(self):
        '''
        Implement the strategy to the exchange.
        Data json: exchange, symbol, timeframe, strategy
        '''
        data = request.get_json()
        exchange = data['exchange']
        symbol = data['symbol']
        timeframe = data['timeframe']
        strategy = data['strategy']
        channel = 'trading-platform'
        q = Queue(channel, connection=self.redis_conn)
        result = q.enqueue(Trade, exchange, symbol, timeframe, strategy)
        return ResponseCode.SUCCESS if result else ResponseCode.BAD_REQUEST
        