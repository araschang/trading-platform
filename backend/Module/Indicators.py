import pandas as pd
import numpy as np


def ATR(DF, period=14):
    df = DF.copy()
    df['H-L'] = df['high'] - df['low']
    df['H-PC'] = abs(df['high'] - df['close'].shift(1))
    df['L-PC'] = abs(df['low'] - df['close'].shift(1))
    df['TR'] = df[['H-L', 'H-PC', 'L-PC']].max(axis=1, skipna=False)
    df['ATR'] = df['TR'].ewm(span=period, min_periods=period).mean()
    return df['ATR']

def KD(DF, period=14):
    df = DF.copy()
    df['low_min'] = df['low'].rolling(period).min()
    df['high_max'] = df['high'].rolling(period).max()
    df['RSV'] = 100 * (df['close'] - df['low_min']) / (df['high_max'] - df['low_min'])
    df['K'] = df['RSV'] * 1/3 + df['RSV'].shift(1) * 2/3
    df['D'] = df['K'] * 1/3 + df['K'].shift(1) * 2/3
    return df.loc[:, ['K', 'D']]

def MACD(DF, fast=12, slow=26, signal=9):
    df = DF.copy()
    df['ma_fast'] = df['close'].ewm(span=fast, min_periods=fast).mean()
    df['ma_slow'] = df['close'].ewm(span=slow, min_periods=slow).mean()
    df['MACD'] = df['ma_fast'] - df['ma_slow']
    df['signal'] = df['MACD'].ewm(span=signal, min_periods=signal).mean()
    return df.loc[:, ['MACD', 'signal']]

def EMA(df, length):
    return df['close'].ewm(com=length, min_periods=length).mean()

def CAGR(DF, timeframe, backtest_range):
    "function to calculate the Cumulative Annual Growth Rate of a trading strategy"
    df = DF.copy()
    df["cum_return"] = (1 + df["ret"]).cumprod()
    if timeframe == '1m':
        n = (1/365)
    elif timeframe == '5m':
        n = (5/365)
    elif timeframe == '1h':
        n = (1/12)
    elif timeframe == '4h' or timeframe == '1d':
        if backtest_range == '1mon':
            n = (1/12)
        elif backtest_range == '3mon':
            n = (3/12)
        elif backtest_range == '6mon':
            n = (6/12)
    CAGR = (df["cum_return"].tolist()[-1])**(1/n) - 1
    return CAGR

def volatility(DF):
    "function to calculate annualized volatility of a trading strategy"
    df = DF.copy()
    vol = df["ret"].std() * np.sqrt(252*78)
    return vol

def sharpe(DF, rf, timeframe, backtest_range):
    "function to calculate sharpe ratio ; rf is the risk free rate"
    df = DF.copy()
    sr = (CAGR(df, timeframe, backtest_range) - rf)/volatility(df)
    return sr

def max_dd(DF):
    "function to calculate max drawdown"
    df = DF.copy()
    df["cum_return"] = (1 + df["ret"]).cumprod()
    df["cum_roll_max"] = df["cum_return"].cummax()
    df["drawdown"] = df["cum_roll_max"] - df["cum_return"]
    df["drawdown_pct"] = df["drawdown"]/df["cum_roll_max"]
    max_dd = df["drawdown_pct"].max()
    return max_dd
