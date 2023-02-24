from flask_restful import Api
from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from Routes.BacktestController import BacktestController
from Routes.TradeController import TradeController, TradeTransactionController
from Routes.MembershipController import MembershipController, MemberLoginController
from Module.Trade import Trade
from Base.Connector import MongoConnector

app = Flask(__name__)
api = Api(app)
scheduler = BackgroundScheduler()

def job():
    tradeMemberList = MongoConnector().getTradeMemberConn().find({})
    tradeMemberList = list(tradeMemberList)
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

# scheduler.add_job(job, 'interval', seconds=60)
# scheduler.start()

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

if __name__ == '__main__':
    app.run(debug=True)
