import React from 'react';

const Forecast = ({ data, unit, lang, t }) => {
    // data structure is now { hourly: [...], daily: [...], city: {...} } from weatherService generic adapter
    if (!data || !data.hourly || !data.daily) return null;

    const { hourly, daily } = data;

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
                direction: 'ltr'
            }}>
                {hourly.map((item, index) => (
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
                            {/* item.time is "YYYY-MM-DD HH:MM", we just want HH:MM */}
                            {item.time.split(' ')[1]}
                        </span>
                        <img
                            src={item.icon}
                            alt={item.condition}
                            style={{ width: '35px', height: '35px' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>{displayTemp(item.temp)}°</span>
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
                {daily.map((item, index) => {
                    const date = new Date(item.date);
                    // item.date is "YYYY-MM-DD", which creates a UTC date at midnight? 
                    // Or local midnight? Browser treats "YYYY-MM-DD" as UTC usually.
                    // Actually, if we just want "Day(Weekday)", we can parse the parts manually or use UTC methods to be safe.
                    // Let's use string parts for dayNum to be robust against timezone shifts.
                    const dayNum = item.date.split('-')[2];

                    // For weekday, we can use the date object.
                    const weekday = date.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' });

                    const formattedDate = `${parseInt(dayNum)}(${weekday})`; // parseInt to remove leading zero if desired e.g. 05 -> 5

                    return (
                        <div key={index} style={{
                            background: 'rgba(255, 255, 255, 0.15)',
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
                                src={item.icon}
                                alt={item.condition}
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
