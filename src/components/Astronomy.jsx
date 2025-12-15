import React from 'react';
import { Sunrise, Sunset, Moon } from 'lucide-react';

const Astronomy = ({ astro, t }) => {
    if (!astro) return null;

    return (
        <div style={{
            marginTop: '2rem',
            width: '100%',
            maxWidth: '800px',
            margin: '2rem auto',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white'
        }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t ? t('astronomy') : 'Astronomy'}</h3>

            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                {/* Sunrise */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Sunrise size={32} color="#FFD700" />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t ? t('sunrise') : 'Sunrise'}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{astro.sunrise}</span>
                </div>

                {/* Sunset */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Sunset size={32} color="#FF8C00" />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t ? t('sunset') : 'Sunset'}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{astro.sunset}</span>
                </div>

                {/* Moon Phase */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Moon size={32} color="#C0C0C0" />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t ? t('moon_phase') : 'Moon Phase'}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{astro.moonPhase}</span>
                </div>
            </div>
        </div>
    );
};

export default Astronomy;
