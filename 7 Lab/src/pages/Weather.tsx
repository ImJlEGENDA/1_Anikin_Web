import { useState } from 'react';

interface WeatherData {
  temp: number;
  wind: number;
  name: string;
}

export default function Weather() {
  const [city, setCity] = useState('Moscow');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
      const geoData = await geoRes.json();
      
      if (geoData.results) {
        const { latitude, longitude, name } = geoData.results[0];
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const wData = await wRes.json();
        
        setWeather({ temp: wData.current_weather.temperature, wind: wData.current_weather.windspeed, name: name });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className="mb-4">Прогноз погоды</h2>
      <div className="card shadow-sm border-0 col-md-6">
        <div className="card-body">
          <div className="input-group mb-3">
            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
            <button className="btn btn-primary" onClick={fetchWeather}>Узнать</button>
          </div>
          {loading && <p>Ищем...</p>}
          {weather && !loading && (
            <div className="text-center mt-4">
              <h3>{weather.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0d6efd' }}>{weather.temp}°C</div>
              <p className="text-muted">Ветер: {weather.wind} км/ч</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}