from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.strategies.exchange import test_connection, get_exchange

load_dotenv()

app = FastAPI(title="Bokpy Bot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.56.1:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Bokpy Bot API running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/exchange/test")
def exchange_test():
    return test_connection()

@app.get("/balance")
def get_balance():
    try:
        exchange = get_exchange()
        balance = exchange.fetch_balance()
        usdt = balance['total'].get('USDT', 0)
        btc = balance['total'].get('BTC', 0)
        return {
            "status": "ok",
            "balance": {
                "USDT": round(usdt, 2),
                "BTC": round(btc, 8),
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

from app.strategies.strategy import get_current_signal

@app.get("/signal")
def get_signal(symbol: str = "BTC/USDT", timeframe: str = "1h"):
    return get_current_signal(symbol, timeframe)