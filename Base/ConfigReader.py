import configparser
import os
import traceback

class Config(object):
    _configInstance = None

    def __new__(self, *args, **kwargs):
        if self._configInstance is None:
            config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config.ini')

            try:
                self._configInstance = configparser.ConfigParser()
                self._configInstance.read(config_path, encoding='utf8')

            except Exception as e:
                traceback.print_exc()

        return self._configInstance


if __name__ == "__main__":
    config = Config()

    print(config["Binance"]["api_key"])

    pass
