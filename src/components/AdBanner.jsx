import React from 'react';
import { ShoppingBag, Umbrella, Sun, Snowflake, Wind } from 'lucide-react';

const AdBanner = ({ weather, t, lang }) => {
    if (!weather) return null;

    const { temp, title, icon } = weather;
    const condition = title.toLowerCase();

    // -------------------------------------------------------------------------
    // 🔧 [Configuration] Paste your AliExpress Tracking Links here!
    // 1. Go to AliExpress Portals > Link Generator
    // 2. Paste the 'Page URL' for the category (e.g., search result for "Umbrella")
    // 3. Select 'United States' (it acts as a global default, safe to use)
    // 4. Generate & Copy the 'Tracking Link' (s.click...)
    // -------------------------------------------------------------------------
    const AFFILIATE_LINKS = {
        default: "https://s.click.aliexpress.com/e/_c2vo8gil", // Default (Best Sellers)
        rain: "https://s.click.aliexpress.com/e/_c36F7ogh",        // Rain (Umbrella)
        cold: "https://s.click.aliexpress.com/e/_c3lQLTTx",   // Cold (Jackets)
        hot: "https://s.click.aliexpress.com/e/_c4LjoGfX",     // Hot (Fans)
        wind: "https://s.click.aliexpress.com/e/_c2vbBt09"      // Wind (Windbreaker)
    };

    // Contextual Logic
    let recommendation = {
        keyword: 'best sellers',
        message: 'Special Deals for You',
        icon: <ShoppingBag size={24} />,
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        link: AFFILIATE_LINKS.default
    };

    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) {
        recommendation = {
            keyword: 'umbrella raincoat',
            message: 'Rainy day essentials!',
            icon: <Umbrella size={24} />,
            bgGradient: 'linear-gradient(135deg, #3a6186 0%, #89253e 100%)',
            link: AFFILIATE_LINKS.rain
        };
    } else if (condition.includes('snow') || condition.includes('ice') || condition.includes('blizzard') || temp < 5) {
        recommendation = {
            keyword: 'winter jacket hot pack',
            message: 'Stay warm this winter!',
            icon: <Snowflake size={24} />,
            bgGradient: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
            textColor: '#1e3c72', // Dark text for light bg
            link: AFFILIATE_LINKS.cold
        };
    } else if ((condition.includes('clear') || condition.includes('sunny')) && temp > 25) {
        recommendation = {
            keyword: 'portable fan sunglasses',
            message: 'Beat the heat!',
            icon: <Sun size={24} />,
            bgGradient: 'linear-gradient(135deg, #fce38a 0%, #f38181 100%)',
            textColor: '#c0392b',
            link: AFFILIATE_LINKS.hot
        };
    } else if (condition.includes('wind')) {
        recommendation = {
            keyword: 'windbreaker jacket',
            message: 'Windy weather gear',
            icon: <Wind size={24} />,
            bgGradient: 'linear-gradient(135deg, #485563 0%, #29323c 100%)',
            link: AFFILIATE_LINKS.wind
        };
    }

    // Use the specific link for the condition
    const affiliateLink = recommendation.link;

    return (
        <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block', width: '100%', marginTop: '1.5rem' }}
        >
            <div style={{
                background: recommendation.bgGradient,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: recommendation.textColor || 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
            }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '10px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {recommendation.icon}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{recommendation.message}</h4>
                        <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            Check out best {recommendation.keyword.split(' ')[0]} deals &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default AdBanner;
