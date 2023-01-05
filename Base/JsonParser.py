class JsonParser:
    def parse_strategies(strategies):
        check_strategies = []
        for i in strategies:
            if list(i.keys())[0] not in ['ATR', 'MACD', 'EMA']:
                pass
            elif list(i.keys())[0] == 'ATR':
                check_strategies.append(['ATR', int(list(i.values())[0]['atr_period'])])
            elif list(i.keys())[0] == 'MACD':
                check_strategies.append(['MACD', int(list(i.values())[0]['fast']), int(list(i.values())[0]['slow']), int(list(i.values())[0]['signal'])])
            elif list(i.keys())[0] == 'EMA':
                check_strategies.append(['EMA', int(list(i.values())[0]['ema_short_len']), int(list(i.values())[0]['ema_long_len'])])
        return check_strategies

if __name__ == '__main__':
    result = JsonParser.parse_strategies('[{"ATR":{"atr_period": "14"}}, {"MACD":{"fast":"7", "slow":"26", "signal": "10"}}, {"EMA":{"ema_short_len":"20", "ema_long_len":"50"}}]')
    print(result)
