from Base.ConfigReader import Config
from redis import Redis, ConnectionPool

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