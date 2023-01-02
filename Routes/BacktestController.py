from flask_restful import Resource, reqparse
from rq import Queue
from Base.Connector import RedisConnector
from Base.ResponseCode import ResponseCode

class BacktestController(Resource):
    def get(self, exchange, symbol, timeframe):
        pass
    
    def post(self, exchange, symbol, timeframe):
        pass