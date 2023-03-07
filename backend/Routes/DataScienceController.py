from flask_restful import Resource
from flask import request
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode


class SentimentalAnalysisController(Resource):
    def __init__(self):
        mongo = MongoConnector()
        self._sentimentalAnalysisConnection = mongo.getSentimentalAnalysisConn()
    

class PriceNewsCrawlController(Resource):
    def __init__(self):
        mongo = MongoConnector()
        self._priceCrawlConnection = mongo.getPriceCrawlConn()
        self._newsCrawlConnection = mongo.getNewsCrawlConn()