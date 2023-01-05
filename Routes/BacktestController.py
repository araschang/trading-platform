from flask_restful import Resource
from flask import request
from rq import Queue
import json
from Base.Connector import RedisConnector
from Base.ResponseCode import ResponseCode
from Module.Backtest import Backtest


class BacktestController(Resource):
    def __init__(self):
        self.redis_conn = RedisConnector().getConn()

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
        channel = 'trading-platform'
        backtest = Backtest(exchange, symbol, timeframe)
        # Need to debug for rqworker
        # q = Queue(channel, connection=self.redis_conn)

        # For testing
        # result_df = q.enqueue(backtest.get_ohlcv)
        # df = backtest.get_ohlcv()
        # df = backtest.add_strategy(df, strategy)
        # df = backtest.run(df, strategy)
        # result, df = backtest.get_results(df, timeframe)

        result, df = backtest.Backtest(symbol, timeframe, strategy)
        df = df.to_json(orient='records')
        return json.dumps([ResponseCode.SUCCESS, result, df]) if df else ResponseCode.BAD_REQUEST
