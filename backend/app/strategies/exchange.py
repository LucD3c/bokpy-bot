import ccxt
import os
from dotenv import load_dotenv

load_dotenv()

def get_exchange():
    exchange = ccxt.bybit({
        'apiKey': os.getenv('BYBIT_API_KEY'),
        'secret': os.getenv('BYBIT_API_SECRET'),
        'enableRateLimit': True,
        'options': {
            'defaultType': 'spot',
        }
    })

    if os.getenv('BYBIT_TESTNET') == 'true':
        exchange.set_sandbox_mode(True)

    return exchange

def test_connection():
    try:
        exchange = get_exchange()
        balance = exchange.fetch_balance()
        return {
            "status": "ok",
            "message": "Conexión exitosa a Bybit Testnet",
            "balance": balance['total']
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }