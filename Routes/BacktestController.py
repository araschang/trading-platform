from flask_restful import Resource
from flask import request
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode
from Module.Backtest import Backtest


class BacktestController(Resource):
    def __init__(self):
        self._backtestResultConnection = MongoConnector.getBacktestResultConn()

    def post(self):
        '''
        Backtest a strategy.
        Data json: exchange, symbol, timeframe, strategy, backtest_range
        '''
        data = request.get_json()
        exchange = data['exchange']
        symbol = data['symbol']
        timeframe = data['timeframe']
        strategy = data['strategy']
        backtest_range = data['backtest_range']
        backtest = Backtest(symbol, timeframe, backtest_range)
        result, df = backtest.Backtest(symbol, timeframe, strategy)

        # todo: save result to MongoDB

        return result, df.to_json(orient='records'), ResponseCode.SUCCESS
