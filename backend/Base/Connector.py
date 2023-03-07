from redis import Redis, ConnectionPool
from pymongo import MongoClient
from Base.ConfigReader import Config

class Connector(object):
    def __init__(self):
        self.config = Config()


class RedisConnector(Connector):
    def __init__(self):
        super().__init__()
        config = self.config['Redis']
        host = config["HOST"]
        pool = ConnectionPool(host=host)
        self._redisConnection = Redis(connection_pool=pool)

    def getConn(self):
        return self._redisConnection


class MongoConnector(Connector):
    def __init__(self):
        super().__init__()
        config = self.config['MongoDB']
        account = config["Account"]
        password = config["Password"]
        mongoUrl = 'mongodb+srv://' + account + ':' + password + '@tradingplatform.iid8bdl.mongodb.net/?retryWrites=true&w=majority'
        self._mongoConnection = MongoClient(mongoUrl)

    def getMembershipConn(self):
        return self._mongoConnection['Membership']['Information']
    
    def getBacktestResultConn(self):
        return self._mongoConnection['Backtest']['Results']
    
    def getTradeTransactionConn(self):
        return self._mongoConnection['Trade']['Transactions']
    
    def getTradeMemberConn(self):
        return self._mongoConnection['Trade']['Members']
    
    def getSentimentalAnalysisConn(self):
        return self._mongoConnection['SentimentalAnalysis']['Results']
    
    def getPriceCrawlConn(self):
        return self._mongoConnection['PriceNewsCrawl']['Price']
    
    def getNewsCrawlConn(self):
        return self._mongoConnection['PriceNewsCrawl']['News']
