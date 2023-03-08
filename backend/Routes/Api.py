from flask_restful import Api
from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from Routes.BacktestController import BacktestController
from Routes.TradeController import TradeController, TradeTransactionController
from Routes.MembershipController import MembershipController, MemberLoginController
from Routes.DataScienceController import SentimentalAnalysisController, PriceNewsCrawlController
from Module.Trade import Trade
from Module.ML_Sentimental.SentimentalAnalysis import getSentimentScore
from Base.Connector import MongoConnector
import datetime

app = Flask(__name__)
api = Api(app)
scheduler = BackgroundScheduler()

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

        trade = Trade(id, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy)
        trade.Trade()

def job_sentiment():
    getSentimentScore(datetime.date.today())


api.add_resource(
    BacktestController,
    '/backtest',
    )

api.add_resource(
    TradeController,
    '/trade',
    )

api.add_resource(
    TradeTransactionController,
    '/trade/transaction',
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

# scheduler.add_job(job_trade, 'interval', seconds=60)
# scheduler.add_job(job_sentiment, 'interval', days=1)
# scheduler.start()

if __name__ == '__main__':
    # print(getSentimentScore())
    app.run(debug=false)