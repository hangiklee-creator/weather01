import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { weatherService } from '../api/weather';

const SearchBar = ({ onSearch, placeholder, onLocationClick, lang }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce logic: wait 500ms after typing stops
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Only search if not containing result format "City, Country" approx check
            if (query.length > 2) {
                try {
                    const results = await weatherService.searchCities(query);
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Autocomplete error:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setShowSuggestions(false);
        }
    };

    const getLocalizedName = (city) => {
        if (city.local_names && city.local_names[lang]) {
            return city.local_names[lang];
        }
        return city.name;
    };

    const handleSelect = (city) => {
        const localName = getLocalizedName(city);
        const cityName = `${localName}, ${city.country}`;
        setQuery(cityName); // Update display text to selected city
        // Pass the entire city object (which has lat/lon) to parent search handler
        onSearch(city);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} style={{ width: '100%', marginBottom: '2rem', position: 'relative' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder || "Search city..."}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                    />
                    <Search
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            color: 'rgba(255, 255, 255, 0.6)'
                        }}
                        size={20}
                    />
                    <button
                        type="button"
                        onClick={onLocationClick}
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.8,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                        title="Use my location"
                    >
                        <MapPin size={20} />
                    </button>
                </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(30, 60, 114, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    marginTop: '0.5rem',
                    zIndex: 100,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {suggestions.map((city, index) => {
                        const displayName = getLocalizedName(city);
                        return (
                            <div
                                key={`${city.lat}-${city.lon}-${index}`}
                                // Use onMouseDown to ensure it fires before focus/blur logic
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent input blur
                                    handleSelect(city);
                                }}
                                style={{
                                    padding: '0.8rem 1rem',
                                    cursor: 'pointer',
                                    borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span>{displayName}</span>
                                <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>{city.state ? `${city.state}, ` : ''}{city.country}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
