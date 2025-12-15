import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Alerts = ({ alerts, t }) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '800px', margin: '1rem auto' }}>
            {alerts.map((alert, index) => (
                <div key={index} style={{
                    background: 'rgba(255, 59, 48, 0.2)', // Red tint for alerts
                    border: '1px solid rgba(255, 59, 48, 0.5)',
                    borderRadius: '16px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    color: '#ffcccb'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle color="#ff453a" />
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{alert.event}</h3>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t ? t('alert_source') : 'Source'}: {alert.headline}</span>
                    </div>
                    {/* Collapsible description usually better, but for now just show truncated or full */}
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4' }}>
                        {alert.desc}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Alerts;
