import React from 'react';
import { Cloud, Droplets, Wind, Activity, Share2, Facebook, Link as LinkIcon } from 'lucide-react';

const CurrentWeather = ({ data, unit, airQuality, lang, t }) => {
    if (!data) return null;

    const { name, main, weather, wind, timezone } = data;

    const calcLocalTime = (timezoneOffset) => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const newDate = new Date(utc + (1000 * timezoneOffset));

        // Map language code to full locale
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

        return newDate.toLocaleString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: lang !== 'de' && lang !== 'fr' && lang !== 'ru' // 24h format for some common EU/RU preferences, simpler to keep consistent or adapt. 
            // Lets stick to hour12=true for general, or false for specific. 
            // Actually 'toLocaleString' follows locale defaults if hour12 is undefined, but we need consistent format. 
            // Let's rely on locale defaults by omitting hour12 if possible, NO, we want standard format.
            // Let's try explicit 12h for ease of reading unless locale strongly prefers 24h.
        });
    };

    const displayTemp = (temp) => {
        if (unit === 'F') {
            return Math.round((temp * 9 / 5) + 32);
        }
        return Math.round(temp);
    };

    const getAqiDescription = (aqi) => {
        // Map AQI to translation keys
        const keys = { 1: 'good', 2: 'fair', 3: 'moderate', 4: 'poor', 5: 'very_poor' };
        const key = keys[aqi] || 'unknown';
        return t(key);
    };

    // Styling for RTL languages (Arabic)
    const isRTL = lang === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';

    return (
        <div style={{ textAlign: 'center', color: 'white', direction: dir }}>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{name}</h2>
            <p style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', opacity: 0.8 }}>
                {calcLocalTime(timezone)}
            </p>

            <div className="flex-center" style={{ marginBottom: '2rem' }}>
                <img
                    src={`https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`}
                    alt={weather[0].description}
                    style={{ width: '150px', height: '150px' }}
                />
                <div>
                    <h1 style={{ fontSize: '5rem', margin: 0, fontWeight: 'bold' }}>
                        {displayTemp(main.temp)}°
                    </h1>
                    <p style={{ fontSize: '1.5rem', margin: 0, textTransform: 'capitalize', opacity: 0.8 }}>
                        {weather[0].description}
                    </p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                background: 'rgba(0,0,0,0.2)',
                padding: '1.5rem',
                borderRadius: '16px',
                direction: 'ltr' // Keep grid LTR for consistency even in Arabic for now, or adapt icons? Icons + text better LTR for layout stability
            }}>
                <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="flex-center" style={{ gap: '0.5rem', opacity: 0.8 }}>
                        <Droplets size={20} />
                        <span>{t('humidity')}</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{main.humidity}%</span>
                </div>

                <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="flex-center" style={{ gap: '0.5rem', opacity: 0.8 }}>
                        <Wind size={20} />
                        <span>{t('wind')}</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(wind.speed)} km/h</span>
                </div>

                <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="flex-center" style={{ gap: '0.5rem', opacity: 0.8 }}>
                        <Cloud size={20} />
                        <span>{t('feels_like')}</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{displayTemp(main.feels_like)}°</span>
                </div>

                {airQuality && airQuality.list && (
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-center" style={{ gap: '0.5rem', opacity: 0.8 }}>
                            <Activity size={20} />
                            <span>{t('aqi')}</span>
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            {getAqiDescription(airQuality.list[0].main.aqi)}
                        </span>
                    </div>
                )}
            </div>

            {/* Social Share Buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={() => {
                        const text = `Check out the weather in ${name}: ${displayTemp(main.temp)}° - ${weather[0].description}`;
                        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                    }}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}
                    title="Share on X (Twitter)"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <Share2 size={20} />
                </button>
                <button
                    onClick={() => {
                        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                        window.open(url, '_blank');
                    }}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}
                    title="Share on Facebook"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <Facebook size={20} />
                </button>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: `Weather in ${name}`,
                                text: `Check out the weather in ${name}: ${displayTemp(main.temp)}°`,
                                url: window.location.href,
                            }).catch(console.error);
                        } else {
                            navigator.clipboard.writeText(`${name}: ${displayTemp(main.temp)}°`);
                            alert("Copied to clipboard!");
                        }
                    }}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}
                    title="More Share Options"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <LinkIcon size={20} />
                </button>
            </div>
        </div>
    );
};

export default CurrentWeather;
