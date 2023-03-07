from flask_restful import Resource
from flask import request
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode
from Module.Backtest import Backtest


class BacktestController(Resource):
    def __init__(self):
        pass
        mongo = MongoConnector()
        self._backtestResultConnection = mongo.getBacktestResultConn()

    def post(self):
        '''
        Backtest a strategy.
        Data json: exchange, email, symbol, timeframe, strategy, backtest_range
        '''
        
        data = request.get_json()
        exchange = data['exchange']
        email = data['email']
        symbol = data['symbol']
        timeframe = data['timeframe']
        strategy = data['strategy']
        backtest_range = data['backtest_range']
        backtest = Backtest(symbol, timeframe, backtest_range)
        result, df = backtest.Backtest(symbol, timeframe, strategy)

        result['email'] = email
        result['id'] = self._backtestResultConnection.count_documents({'email': email}) + 1

        # save result to MongoDB
        self._backtestResultConnection.insert_one(result)
        return df.to_json(orient='records'), ResponseCode.SUCCESS
