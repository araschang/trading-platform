from flask_restful import Resource
from flask import request
from rq import Queue
from Base.Connector import RedisConnector
from Base.ResponseCode import ResponseCode


class TradeController(Resource):
    def get(self, exchange, symbol, timeframe):
        pass
    
    def post(self, exchange, symbol, timeframe):
        pass