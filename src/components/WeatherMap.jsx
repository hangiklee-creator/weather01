import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Internal component to update map center when props change
const MapUpdater = ({ lat, lon }) => {
    const map = useMap();
    map.setView([lat, lon], map.getZoom());
    return null;
};

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const WeatherMap = ({ lat, lon, city, onMapClick }) => {
    if (!lat || !lon) return null;

    return (
        <div style={{
            marginTop: '2rem',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: '300px',
            width: '100%',
            position: 'relative',
            zIndex: 0 // Ensure it sits below dropdowns if any
        }}>
            <MapContainer
                center={[lat, lon]}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                {/* Standard OpenStreetMap (Bright) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lon]}>
                    <Popup>
                        {city}
                    </Popup>
                </Marker>
                <MapUpdater lat={lat} lon={lon} />
                <MapClickHandler onMapClick={onMapClick} />
            </MapContainer>
        </div>
    );
};

export default WeatherMap;
