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
    
    def getTradeConn(self):
        return self._mongoConnection['Trade']['Transactions']