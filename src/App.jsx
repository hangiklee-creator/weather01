import React, { useState } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherMap from './components/WeatherMap';
import { weatherService } from './api/weather';

const translations = {
  en: {
    title: 'Weather',
    search_placeholder: 'Search city...',
    loading: 'Loading...',
    error_fetch: 'Failed to fetch weather data',
    enter_city: 'Enter a city name to see the weather.',
    humidity: 'Humidity',
    wind: 'Wind',
    feels_like: 'Feels Like',
    aqi: 'AQI',
    hourly_forecast: 'Hourly Forecast',
    daily_forecast: '5-Day Daily',
    good: 'Good',
    fair: 'Fair',
    moderate: 'Moderate',
    poor: 'Poor',
    very_poor: 'Very Poor',
    unknown: 'Unknown'
  },
  ko: {
    title: '날씨',
    search_placeholder: '도시 검색...',
    loading: '로딩 중...',
    error_fetch: '날씨 정보를 가져오는데 실패했습니다',
    enter_city: '날씨를 확인하려면 도시 이름을 입력하세요.',
    humidity: '습도',
    wind: '바람',
    feels_like: '체감 온도',
    aqi: '대기질',
    hourly_forecast: '시간별 예보',
    daily_forecast: '5일 예보',
    good: '좋음',
    fair: '보통',
    moderate: '주의',
    poor: '나쁨',
    very_poor: '매우 나쁨',
    unknown: '알 수 없음'
  },
  de: {
    title: 'Wetter',
    search_placeholder: 'Stadt suchen...',
    loading: 'Laden...',
    error_fetch: 'Wetterdaten konnten nicht abgerufen werden',
    enter_city: 'Geben Sie einen Städtenamen ein.',
    humidity: 'Feuchtigkeit',
    wind: 'Wind',
    feels_like: 'Gefühlt',
    aqi: 'Luftqualität',
    hourly_forecast: 'Stündliche Vorhersage',
    daily_forecast: '5-Tage Vorhersage',
    good: 'Gut',
    fair: 'Okay',
    moderate: 'Mäßig',
    poor: 'Schlecht',
    very_poor: 'Sehr schlecht',
    unknown: 'Unbekannt'
  },
  ja: {
    title: '天気',
    search_placeholder: '都市を検索...',
    loading: '読み込み中...',
    error_fetch: '気象データの取得に失敗しました',
    enter_city: '都市名を入力して天気を確認してください。',
    humidity: '湿度',
    wind: '風',
    feels_like: '体感温度',
    aqi: '空気質',
    hourly_forecast: '時間ごとの予報',
    daily_forecast: '5日間の予報',
    good: '良い',
    fair: '普通',
    moderate: '並',
    poor: '悪い',
    very_poor: '非常に悪い',
    unknown: '不明'
  },
  fr: {
    title: 'Météo',
    search_placeholder: 'Rechercher une ville...',
    loading: 'Chargement...',
    error_fetch: 'Échec de la récupération des données météo',
    enter_city: 'Entrez un nom de ville pour voir la météo.',
    humidity: 'Humidité',
    wind: 'Vent',
    feels_like: 'Ressenti',
    aqi: 'QAI',
    hourly_forecast: 'Prévisions horaires',
    daily_forecast: 'Prévisions sur 5 jours',
    good: 'Bon',
    fair: 'Correct',
    moderate: 'Modéré',
    poor: 'Mauvais',
    very_poor: 'Très mauvais',
    unknown: 'Inconnu'
  },
  ar: {
    title: 'الطقس',
    search_placeholder: 'ابحث عن مدينة...',
    loading: 'جار التحميل...',
    error_fetch: 'فشل في جلب بيانات الطقس',
    enter_city: 'أدخل اسم المدينة لمعرفة الطقس.',
    humidity: 'الرطوبة',
    wind: 'الرياح',
    feels_like: 'شعور بـ',
    aqi: 'جودة الهواء',
    hourly_forecast: 'توقعات كل ساعة',
    daily_forecast: 'توقعات لـ 5 أيام',
    good: 'جيد',
    fair: 'مقبول',
    moderate: 'متوسط',
    poor: 'سيء',
    very_poor: 'سيء جداً',
    unknown: 'غير معروف'
  },
  ru: {
    title: 'Погода',
    search_placeholder: 'Поиск города...',
    loading: 'Загрузка...',
    error_fetch: 'Не удалось получить данные о погоде',
    enter_city: 'Введите название города, чтобы узнать погоду.',
    humidity: 'Влажность',
    wind: 'Ветер',
    feels_like: 'Ощущается',
    aqi: 'ИКВ',
    hourly_forecast: 'Почасовой прогноз',
    daily_forecast: 'Прогноз на 5 дней',
    good: 'Хорошо',
    fair: 'Нормально',
    moderate: 'Средне',
    poor: 'Плохо',
    very_poor: 'Очень плохо',
    unknown: 'Неизвестно'
  },
  es: {
    title: 'Tiempo',
    search_placeholder: 'Buscar ciudad...',
    loading: 'Cargando...',
    error_fetch: 'Error al obtener datos meteorológicos',
    enter_city: 'Ingrese el nombre de una ciudad para ver el clima.',
    humidity: 'Humedad',
    wind: 'Viento',
    feels_like: 'Sensación',
    aqi: 'ICA',
    hourly_forecast: 'Pronóstico por hora',
    daily_forecast: 'Pronóstico de 5 días',
    good: 'Bueno',
    fair: 'Aceptable',
    moderate: 'Moderado',
    poor: 'Malo',
    very_poor: 'Muy malo',
    unknown: 'Desconocido'
  },
  zh: {
    title: '天气',
    search_placeholder: '搜索城市...',
    loading: '加载中...',
    error_fetch: '获取天气数据失败',
    enter_city: '输入城市名称以查看天气。',
    humidity: '湿度',
    wind: '风',
    feels_like: '体感温度',
    aqi: '空气质量',
    hourly_forecast: '每小时预报',
    daily_forecast: '5天预报',
    good: '优',
    fair: '良',
    moderate: '中',
    poor: '差',
    very_poor: '极差',
    unknown: '未知'
  }
};

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  // Auto-detect browser language
  const [lang, setLang] = useState(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    const code = browserLang.split('-')[0];
    const supported = ['en', 'ko', 'de', 'ja', 'fr', 'ar', 'ru', 'es', 'zh'];
    return supported.includes(code) ? code : 'en';
  });

  // Store the last search to re-fetch when language changes
  const [lastSearchData, setLastSearchData] = useState(null);

  const t = (key) => translations[lang][key] || key;

  // Re-fetch when language changes
  React.useEffect(() => {
    if (lastSearchData) {
      handleSearch(lastSearchData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError('');

    // Update last search data only if it is a new search action
    setLastSearchData(searchData);

    try {
      let weatherData, forecastData;
      let lat, lon, cityName;

      // Determine Coordinates
      if (typeof searchData === 'object' && searchData.lat && searchData.lon) {
        // From Autocomplete or Location Button
        lat = searchData.lat;
        lon = searchData.lon;
        cityName = searchData.name;

        // Try to use the localized name if available (passed from autocomplete)
        if (searchData.local_names && searchData.local_names[lang]) {
          cityName = searchData.local_names[lang];
        }
      } else {
        // From Manual Input (String)
        // 1. Geocode the string first to get coordinates
        const results = await weatherService.searchCities(searchData);
        if (!results || results.length === 0) {
          throw new Error(t('error_fetch') + ": City not found");
        }
        const bestMatch = results[0];
        lat = bestMatch.lat;
        lon = bestMatch.lon;

        // Use localized name from geocoding result if avail
        cityName = bestMatch.name;
        if (bestMatch.local_names && bestMatch.local_names[lang]) {
          cityName = bestMatch.local_names[lang];
        }
      }

      // Map internal language codes to OWM API codes
      let apiLang = lang;
      if (lang === 'ko') apiLang = 'kr';
      if (lang === 'zh') apiLang = 'zh_cn';

      // 2. Fetch Weather by Coordinates (Always robust)
      weatherData = await weatherService.getCurrentWeatherByCoords(lat, lon, apiLang);
      forecastData = await weatherService.getForecastByCoords(lat, lon, apiLang);

      // Override the API-returned name with our best-known name (localized)
      if (cityName) {
        weatherData.name = cityName;
      }

      const airQualityData = await weatherService.getAirPollution(lat, lon);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(airQualityData);
    } catch (err) {
      console.error(err);
      setError(err.message || t('error_fetch'));
      setCurrentWeather(null);
      setForecast(null);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleSearch({ lat: latitude, lon: longitude });
        },
        (err) => {
          console.error(err);
          setError("Location access denied or unavailable.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Layout>
      <div className="flex-center" style={{ flexDirection: 'column', width: '100%', position: 'relative' }}>

        {/* Top Right Controls */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          gap: '12px'
        }}>
          {/* Language Switcher Dropdown */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'transparent',
                color: 'white',
                border: 'none',
                outline: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <option value="ko" style={{ color: 'black' }}>한국어</option>
              <option value="en" style={{ color: 'black' }}>English</option>
              <option value="de" style={{ color: 'black' }}>Deutsch</option>
              <option value="ja" style={{ color: 'black' }}>日本語</option>
              <option value="fr" style={{ color: 'black' }}>Français</option>
              <option value="ar" style={{ color: 'black' }}>العربية</option>
              <option value="ru" style={{ color: 'black' }}>Русский</option>
              <option value="es" style={{ color: 'black' }}>Español</option>
              <option value="zh" style={{ color: 'black' }}>中文</option>
            </select>
          </div>

          {/* Unit Switcher */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '4px',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setUnit('C')}
              style={{
                background: unit === 'C' ? 'white' : 'transparent',
                color: unit === 'C' ? '#1e3c72' : 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '4px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              style={{
                background: unit === 'F' ? 'white' : 'transparent',
                color: unit === 'F' ? '#1e3c72' : 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '4px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              °F
            </button>
          </div>
        </div>

        <h1 className="text-gradient" style={{ fontSize: '3rem', margin: '0 0 2rem 0', textAlign: 'center' }}>
          {t('title')}
        </h1>
        <SearchBar onSearch={handleSearch} placeholder={t('search_placeholder')} onLocationClick={handleLocationClick} lang={lang} />

        {loading && <div style={{ color: 'white' }}>{t('loading')}</div>}

        {error && (
          <div style={{
            color: '#ff6b6b',
            background: 'rgba(255, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && !currentWeather && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>{t('enter_city')}</p>
          </div>
        )}

        {currentWeather && <CurrentWeather data={currentWeather} unit={unit} airQuality={airQuality} lang={lang} t={t} />}
        {currentWeather && (
          <WeatherMap
            lat={currentWeather.coord.lat}
            lon={currentWeather.coord.lon}
            city={currentWeather.name}
            onMapClick={(lat, lon) => handleSearch({ lat, lon })}
          />
        )}
        {forecast && <Forecast data={forecast} unit={unit} lang={lang} t={t} />}
      </div>
    </Layout>
  );
}

export default App;
