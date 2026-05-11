import { useState } from 'react';

interface Coin {
  symbol: string;
  price: string;
}

export default function Market() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMarket = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22%5D');
      const data: Coin[] = await res.json();
      setCoins(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className="mb-4">Курс Криптовалют</h2>
      <button className="btn btn-success mb-3" onClick={fetchMarket}>Обновить курсы</button>
      {loading && <p>Загрузка...</p>}
      <div className="row">
        {coins.map((c) => (
          <div className="col-md-4 mb-3" key={c.symbol}>
            <div className="card shadow-sm text-center border-primary">
              <div className="card-body">
                <h5 className="card-title">{c.symbol.replace('USDT', '')}</h5>
                <p className="fs-3 fw-bold text-primary">${parseFloat(c.price).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}