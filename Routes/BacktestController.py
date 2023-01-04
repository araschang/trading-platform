from flask_restful import Resource
from flask import request
from rq import Queue
from Base.Connector import RedisConnector
from Base.ResponseCode import ResponseCode
from Module.Backtest import Backtest


class BacktestController(Resource):
    def post(self):
        '''
        Backtest a strategy.
        Data json: exchange, symbol, timeframe, strategy, start, end
        '''
        data = request.get_json()
        exchange = data['exchange']
        symbol = data['symbol']
        timeframe = data['timeframe']
        strategy = data['strategy']
        start = data['start']
        end = data['end']
        q = Queue(connection=RedisConnector().getRedisConn())
        result, result_df = q.enqueue(Backtest.Backtest, exchange, symbol, timeframe, strategy, start, end)
        return result, result_df, ResponseCode.SUCCESS if result else ResponseCode.BAD_REQUEST
