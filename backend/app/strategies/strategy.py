import pandas as pd
import ccxt
from app.strategies.exchange import get_exchange

def get_candles(symbol='BTC/USDT', timeframe='1h', limit=100):
    exchange = get_exchange()
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    return df

def calculate_signals(df):
    df['ema9'] = df['close'].ewm(span=9).mean()
    df['ema21'] = df['close'].ewm(span=21).mean()
    df['signal'] = 'HOLD'
    for i in range(1, len(df)):
        if df['ema9'].iloc[i] > df['ema21'].iloc[i] and df['ema9'].iloc[i-1] <= df['ema21'].iloc[i-1]:
            df.loc[df.index[i], 'signal'] = 'BUY'
        elif df['ema9'].iloc[i] < df['ema21'].iloc[i] and df['ema9'].iloc[i-1] >= df['ema21'].iloc[i-1]:
            df.loc[df.index[i], 'signal'] = 'SELL'
    return df

def get_current_signal(symbol='BTC/USDT', timeframe='1h'):
    try:
        df = get_candles(symbol, timeframe)
        df = calculate_signals(df)
        last = df.iloc[-1]
        return {
            "status": "ok",
            "symbol": symbol,
            "timeframe": timeframe,
            "price": round(last['close'], 2),
            "ema9": round(last['ema9'], 2),
            "ema21": round(last['ema21'], 2),
            "signal": last['signal']
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}