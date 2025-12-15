import React from 'react';

const Forecast = ({ data, unit, lang, t }) => {
    if (!data || !data.hourly || !data.daily) return null;

    const { daily } = data; // We only need daily for the graph

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

    // 1. Prepare Data for Graph
    // map daily data to numeric values we can scale
    const graphData = daily.map(item => ({
        min: displayTemp(item.min),
        max: displayTemp(item.max),
        icon: item.icon,
        date: item.date
    }));

    // Find min and max for Y-axis scaling
    const allTemps = [...graphData.map(d => d.min), ...graphData.map(d => d.max)];
    const minVal = Math.min(...allTemps);
    const maxVal = Math.max(...allTemps);

    // Add padding to Y-axis range so points aren't on the edge
    const paddingY = 5;
    const range = (maxVal - minVal) + (paddingY * 2);
    // Avoid divide by zero if range is 0 (all temps same)
    const safeRange = range === 0 ? 10 : range;
    const minY = minVal - paddingY;

    // Dimensions
    const width = 800;
    const height = 300;
    const paddingX = 50;

    // Helper to get X, Y coordinates
    const getX = (index) => {
        // Distribute points evenly across width
        const availableWidth = width - (paddingX * 2);
        const step = availableWidth / (graphData.length - 1);
        return paddingX + (step * index);
    };

    const getY = (temp) => {
        // Invert Y because SVG 0 is at top
        // Normalizer: (temp - minY) / range  -> 0 to 1
        // Scale to height: * availableHeight
        // Invert: height - value
        // Add vertical padding for top/bottom labels
        const availableHeight = height - 100; // 50px top, 50px bottom padding
        const normalized = (temp - minY) / safeRange;
        return (height - 50) - (normalized * availableHeight);
    };

    // Generate Path Strings
    const generatePath = (type) => {
        return graphData.map((d, i) => {
            const x = getX(i);
            const y = getY(d[type]);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    const maxPath = generatePath('max');
    const minPath = generatePath('min');

    return (
        <div style={{ marginTop: '2rem', width: '100%' }}>
            {/* Hourly Section - Kept as horizontal scroll */}
            <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('hourly_forecast')}</h3>
            <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                marginBottom: '2rem',
                direction: 'ltr'
            }}>
                {data.hourly.map((item, index) => (
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


            {/* Daily Section - Graph View */}
            <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('daily_forecast')}</h3>

            <div style={{
                width: '100%',
                overflowX: 'auto', // Allow scroll on very small screens if needed, though SVG scales
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '600px' }}>

                    {/* Grid Lines (Optional, maybe just vertical lines for days?) */}
                    {graphData.map((d, i) => (
                        <line
                            key={`grid-${i}`}
                            x1={getX(i)} y1={50}
                            x2={getX(i)} y2={height - 50}
                            stroke="rgba(255,255,255,0.1)"
                            strokeDasharray="4"
                        />
                    ))}

                    {/* Connecting Area or Lines */}
                    {/* Max Temp Line (Red) */}
                    <path d={maxPath} fill="none" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Min Temp Line (Blue) */}
                    <path d={minPath} fill="none" stroke="#4dabf7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points and Labels */}
                    {graphData.map((d, i) => {
                        const x = getX(i);
                        const yMax = getY(d.max);
                        const yMin = getY(d.min);

                        const dateObj = new Date(d.date);
                        // Using split logic for date display consistency
                        const dayNum = d.date.split('-')[2];
                        const weekday = dateObj.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' });
                        const label = `${parseInt(dayNum)}(${weekday})`;

                        return (
                            <g key={i}>
                                {/* Day Label at bottom */}
                                <text x={x} y={height - 15} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                                    {label}
                                </text>
                                {/* Icon above MAX point */}
                                <image x={x - 20} y={yMax - 60} width="40" height="40" href={d.icon} />

                                {/* Max Point & Text */}
                                <circle cx={x} cy={yMax} r="6" fill="#ff6b6b" stroke="white" strokeWidth="2" />
                                <text x={x} y={yMax - 15} textAnchor="middle" fill="#ff6b6b" fontSize="16" fontWeight="bold">
                                    {d.max}°
                                </text>

                                {/* Min Point & Text */}
                                <circle cx={x} cy={yMin} r="6" fill="#4dabf7" stroke="white" strokeWidth="2" />
                                <text x={x} y={yMin + 25} textAnchor="middle" fill="#4dabf7" fontSize="16" fontWeight="bold">
                                    {d.min}°
                                </text>
                            </g>
                        );
                    })}

                </svg>
            </div>
        </div>
    );
};

export default Forecast;
