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

def MACD(DF, fast=12, slow=26, signal=9):
    df = DF.copy()
    df['ma_fast'] = df['close'].ewm(span=fast, min_periods=fast).mean()
    df['ma_slow'] = df['close'].ewm(span=slow, min_periods=slow).mean()
    df['MACD'] = df['ma_fast'] - df['ma_slow']
    df['signal'] = df['MACD'].ewm(span=signal, min_periods=signal).mean()
    return df.loc[:, ['MACD', 'signal']]

def EMA(df, length):
    return df['close'].ewm(com=length, min_periods=length).mean()

def CAGR(DF):
    "function to calculate the Cumulative Annual Growth Rate of a trading strategy"
    df = DF.copy()
    df["cum_return"] = (1 + df["ret"]).cumprod()
    n = len(df)/(365*288)
    CAGR = (df["cum_return"].tolist()[-1])**(1/n) - 1
    return CAGR

def volatility(DF):
    "function to calculate annualized volatility of a trading strategy"
    df = DF.copy()
    vol = df["ret"].std() * np.sqrt(252*78)
    return vol

def sharpe(DF,rf):
    "function to calculate sharpe ratio ; rf is the risk free rate"
    df = DF.copy()
    sr = (CAGR(df) - rf)/volatility(df)
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
