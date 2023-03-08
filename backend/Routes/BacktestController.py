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
    
    def get(self, email):
        '''
        Get backtest results
        Data json: email
        '''
        result = list(self._backtestResultConnection.find({'email': email}))

        if len(result) == 0:
            return ResponseCode.MEMBER_NOT_EXIST
        
        for i in range(len(result)):
            result[i].pop('_id')
        return result, ResponseCode.SUCCESS

    def post(self, email):
        '''
        Backtest a strategy.
        Data json: exchange, email, symbol, timeframe, strategy, backtest_range
        '''
        
        data = request.get_json()
        exchange = data['exchange']
        symbol = data['symbol']
        timeframe = data['timeframe']
        strategy = data['strategy']
        backtest_range = data['backtest_range']
        backtest = Backtest(symbol, timeframe, backtest_range, strategy)
        result, df = backtest.Backtest()

        result['email'] = email
        result['data'] = data
        result['id'] = self._backtestResultConnection.count_documents({'email': email}) + 1

        # save result to MongoDB
        self._backtestResultConnection.insert_one(result)
        return df.to_json(orient='records'), ResponseCode.SUCCESS
