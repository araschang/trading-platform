import pandas as pd
import os
import json
from flask_restful import Resource
from Base.Connector import MongoConnector
from Base.ResponseCode import ResponseCode
from Module.Wordcloud import getWordCloud


class SentimentalAnalysisController(Resource):
    def __init__(self):
        mongo = MongoConnector()
        self._sentimentalAnalysisConnection = mongo.getSentimentalAnalysisConn()
    
    def get(self):
        '''
        Get newest sentimental data
        '''
        path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Module/ML_Sentimental/sentiment_data.csv')
        df = pd.read_csv(path)
        value = df.iloc[-1, 1]
        return value, ResponseCode.SUCCESS
    

class PriceNewsCrawlController(Resource):
    def __init__(self):
        mongo = MongoConnector()
        self._priceCrawlConnection = mongo.getPriceCrawlConn()
        self._newsCrawlConnection = mongo.getNewsCrawlConn()
    
    def get(self):
        '''
        Get news data.
        '''
        path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Module/PriceNews/result.json')
        with open(path) as f:
            j = json.load(f)
        return j, ResponseCode.SUCCESS

class WordCloudController(Resource):
    def get(self):
        '''
        Get word cloud data.
        '''
        code = getWordCloud()
        return code, ResponseCode.SUCCESS
