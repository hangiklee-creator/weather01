import React from 'react';

const Forecast = ({ data, unit, lang, t }) => {
    if (!data || !data.list) return null;

    const displayTemp = (temp) => {
        if (unit === 'F') {
            return Math.round((temp * 9 / 5) + 32);
        }
        return Math.round(temp);
    };

    const localeMap = {
        'en': 'en-US',
        'ko': 'ko-KR',
        'de': 'de-DE',
        'ja': 'ja-JP',
        'fr': 'fr-FR',
        'ar': 'ar-EG',
        'ru': 'ru-RU',
        'es': 'es-ES',
        'zh': 'zh-CN'
    };
    const locale = localeMap[lang] || 'en-US';

    // 1. Hourly Forecast section (first 5 intervals ~ 15 hours)
    const hourlyForecast = data.list.slice(0, 5);

    // 2. Daily Forecast section (aggregating by day for Min/Max)
    const dailyGroups = {};
    data.list.forEach((item) => {
        const dateStr = item.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
        if (!dailyGroups[dateStr]) {
            dailyGroups[dateStr] = [];
        }
        dailyGroups[dateStr].push(item);
    });

    // Convert groups map to array and take up to 5 days
    const dailyForecast = Object.keys(dailyGroups).slice(0, 5).map(dateStr => {
        const items = dailyGroups[dateStr];
        // Find min and max temp in this day's items
        const minTemp = Math.min(...items.map(i => i.main.temp_min));
        const maxTemp = Math.max(...items.map(i => i.main.temp_max));
        // Use the middle item for icon/description as a representative
        const representative = items[Math.floor(items.length / 2)];

        return {
            dt: representative.dt,
            min: minTemp,
            max: maxTemp,
            weather: representative.weather[0]
        };
    });

    return (
        <div style={{ marginTop: '2rem', width: '100%' }}>

            {/* Hourly Section */}
            <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('hourly_forecast')}</h3>
            <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                marginBottom: '2rem',
                direction: 'ltr' // Scrolling usually feels better LTR even in RTL layouts for timelines, but strict RTL might prefer RTL. 
                // However, standard scrollbars are easiest to manage LTR for this horizontal list.
            }}>
                {hourlyForecast.map((item, index) => (
                    <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '1rem',
                        borderRadius: '12px',
                        minWidth: '70px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            {new Date(item.dt * 1000).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt={item.weather[0].main}
                            style={{ width: '35px', height: '35px' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>{displayTemp(item.main.temp)}°</span>
                    </div>
                ))}
            </div>

            {/* Daily Section */}
            <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('daily_forecast')}</h3>
            <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                direction: 'ltr'
            }}>
                {dailyForecast.map((item, index) => {
                    const date = new Date(item.dt * 1000);
                    const dayNum = date.getDate();
                    const weekday = date.toLocaleDateString(locale, { weekday: 'short' });
                    const formattedDate = `${dayNum}(${weekday})`;

                    return (
                        <div key={index} style={{
                            background: 'rgba(255, 255, 255, 0.15)', // slightly distinct bg
                            padding: '1rem',
                            borderRadius: '12px',
                            minWidth: '90px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{formattedDate}</span>
                            <img
                                src={`https://openweathermap.org/img/wn/${item.weather.icon}.png`}
                                alt={item.weather.main}
                                style={{ width: '40px', height: '40px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', fontSize: '1.1rem' }}>
                                <span style={{ opacity: 0.6 }}>{displayTemp(item.min)}°</span>
                                <span style={{ fontWeight: 'bold' }}>{displayTemp(item.max)}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
