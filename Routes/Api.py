from flask_restful import Api, Resource, reqparse
from flask import Flask
import pandas as pd
import numpy as np
import json
import os
import sys
import time
import ccxt
from datetime import datetime, timedelta
from Module.Indicators import *
from Module.Backtest import Backtest


app = Flask(__name__)
api = Api(app)

class Backtest(Resource):
    def get(self, exchange, symbol, timeframe):
        pass
    
    def post(self, exchange, symbol, timeframe):
        pass

api.add_resource(Backtest, '/backtest/<string:exchange>/<string:symbol>/<string:timeframe>')
if __name__ == '__main__':
    app.run(debug=True)
