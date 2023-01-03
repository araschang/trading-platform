from flask_restful import Api
from flask import Flask
from Module.Indicators import *
from Routes.BacktestController import BacktestController
from Routes.TradeController import TradeController


app = Flask(__name__)
api = Api(app)

api.add_resource(
    BacktestController,
    '/backtest/<string:exchange>/<string:symbol>/<string:timeframe>',
    )

api.add_resource(
    TradeController,
    '/trade/<string:exchange>/<string:symbol>/<string:timeframe>',
    )

if __name__ == '__main__':
    app.run(debug=True)
