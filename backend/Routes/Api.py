from flask_restful import Api
from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from Routes.BacktestController import BacktestController
from Routes.TradeController import TradeController, TradeTransactionController
from Routes.MembershipController import MembershipController, MemberLoginController
from Routes.DataScienceController import SentimentalAnalysisController, PriceNewsCrawlController, WordCloudController
from Module.Trade import Trade
from Module.ML_Sentimental.SentimentalAnalysis import getSentimentScore
from Module.ML_Sentimental.Crawler.TwitterAPI import getTwitterData
from Module.PriceNews.NewsCrawler import getNewsData
from Module.ML_Sentimental.CVIFolder.cvi_crawler import getCVIData
from Base.Connector import MongoConnector
import datetime

app = Flask(__name__)
api = Api(app)
scheduler = BackgroundScheduler(job_defaults={'max_instances': 3})

def job_trade():
    tradeMemberList = MongoConnector().getTradeMemberConn().find({})
    tradeMemberList = list(tradeMemberList)
    if len(tradeMemberList) == 0:
        return
    for tradeMember in tradeMemberList:
        id = tradeMember['id']
        exchange = tradeMember['exchange']
        api_key = tradeMember['api_key']
        api_secret = tradeMember['api_secret']
        pass_phrase = tradeMember['pass_phrase']
        symbol = tradeMember['symbol']
        money = tradeMember['money']
        timeframe = tradeMember['timeframe']
        strategy = tradeMember['strategy']

        try:
            trade = Trade(id, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy)
            trade.Trade()
        except Exception as e:
            mongo = MongoConnector()
            tradeMemberConnection = mongo.getTradeMemberConn()
            tradeMemberConnection.update_one({'id': id}, {'$set': {'problem': '1'}})
    print('JOB "TRADE" DONE')

def job_sentiment():
    getSentimentScore(datetime.date.today())
    print('JOB "SENTIMENT" DONE')

def job_twitter():
    getTwitterData()
    print('JOB "TWITTER" DONE')

def job_news():
    getNewsData()
    print('JOB "NEWS" DONE')

def job_cvi():
    getCVIData()
    print('JOB "CVI" DONE')

api.add_resource(
    BacktestController,
    '/backtest/<email>',
    )

api.add_resource(
    TradeController,
    '/trade/<email>',
    )

api.add_resource(
    TradeTransactionController,
    '/trade/transaction/<email>',
)

api.add_resource(
    MembershipController,
    '/membership',
)

api.add_resource(
    MemberLoginController,
    '/login',
)

api.add_resource(
    SentimentalAnalysisController,
    '/sentiment',
)

api.add_resource(
    PriceNewsCrawlController,
    '/crawl',
)

api.add_resource(
    WordCloudController,
    '/wordcloud',
)

scheduler.add_job(job_trade, 'interval', seconds=60)
scheduler.add_job(job_cvi, 'interval', minutes=60)
scheduler.add_job(job_twitter, 'interval', minutes=60, next_run_time=datetime.datetime.now() + datetime.timedelta(seconds=30))
scheduler.add_job(job_news, 'interval', minutes=60 ,next_run_time=datetime.datetime.now() + datetime.timedelta(seconds=60))
scheduler.add_job(job_sentiment, 'interval', minutes=60 , next_run_time=datetime.datetime.now() + datetime.timedelta(seconds=90))
scheduler.start()

if __name__ == '__main__':
    print(getSentimentScore())
