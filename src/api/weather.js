const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Internal helper to map WeatherAPI condition codes/icons to generic internal state or Keep them as is.
// WeatherAPI provides full URLs for icons, which is convenient.

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 400 || response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || "API Error");
        }
        throw new Error("Weather service error");
    }
    return response.json();
};

export const weatherService = {
    // Search for cities (Autocomplete)
    searchCities: async (query) => {
        if (!API_KEY) throw new Error("API Key is missing");
        if (!query) return [];
        const response = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
        const data = await handleResponse(response);
        // Map to consistent format: { name, lat, lon, country, region }
        return data.map(item => ({
            name: item.name,
            lat: item.lat,
            lon: item.lon,
            country: item.country,
            region: item.region
        }));
    },

    // Get Current Weather (Mapped to Generic UI Format)
    getCurrentWeatherByCoords: async (lat, lon, lang = 'en') => {
        if (!API_KEY) throw new Error("API Key is missing");
        // days=1 gives current + today's forecast. We also want alerts=yes.
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=1&aqi=yes&alerts=yes&lang=${lang}`);
        const data = await handleResponse(response);

        const current = data.current;
        const day = data.forecast.forecastday[0].day;
        const location = data.location;

        return {
            name: location.name,
            country: location.country,
            localTime: location.localtime, // "2023-10-25 10:30"
            temp: current.temp_c,
            feelsLike: current.feelslike_c,
            humidity: current.humidity,
            windSpeed: current.wind_kph,
            title: current.condition.text,
            icon: `https:${current.condition.icon}`,
            minTemp: day.mintemp_c,
            maxTemp: day.maxtemp_c,
            aqi: current.air_quality ? current.air_quality['us-epa-index'] : null,
            coord: { lat: location.lat, lon: location.lon },
            timezone: location.tz_id,
            // Add alerts
            alerts: data.alerts && data.alerts.alert ? data.alerts.alert : [],
            // Add astro for today
            astro: {
                sunrise: data.forecast.forecastday[0].astro.sunrise,
                sunset: data.forecast.forecastday[0].astro.sunset,
                moonPhase: data.forecast.forecastday[0].astro.moon_phase,
                moonIllumination: data.forecast.forecastday[0].astro.moon_illumination
            }
        };
    },

    // Get Forecast (Mapped to Generic UI Format)
    getForecastByCoords: async (lat, lon, lang = 'en') => {
        if (!API_KEY) throw new Error("API Key is missing");
        // STARTER PLAN: 7 Days Forecast
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no&lang=${lang}`);
        const data = await handleResponse(response);

        // Map Daily Forecast
        const daily = data.forecast.forecastday.map(d => ({
            date: d.date, // "2023-10-25"
            dateEpoch: d.date_epoch,
            min: d.day.mintemp_c,
            max: d.day.maxtemp_c,
            condition: d.day.condition.text,
            icon: `https:${d.day.condition.icon}`,
            probRain: d.day.daily_chance_of_rain
        }));

        // Map Hourly Forecast (Next 24 hours or so)
        // WeatherAPI gives hour-by-hour for each forecast day.
        // We can flatten the first 24h from 'now'
        const nowEpoch = data.location.localtime_epoch;
        let hourly = [];

        data.forecast.forecastday.forEach(day => {
            day.hour.forEach(h => {
                if (h.time_epoch > nowEpoch) {
                    hourly.push({
                        time: h.time, // "2023-10-25 11:00"
                        timeEpoch: h.time_epoch,
                        temp: h.temp_c,
                        condition: h.condition.text,
                        icon: `https:${h.condition.icon}`
                    });
                }
            });
        });

        // Limit to next 15 hours like before
        hourly = hourly.slice(0, 5);

        return {
            daily,
            hourly,
            city: {
                name: data.location.name,
                timezone: data.location.tz_id
            }
        };
    },

    // Air Pollution is included in current/forecast calls if aqi=yes
    // So we don't strictly need a separate call, but for compatibility we can keep a stub or remove usage.
    // We integrated AQI into 'getCurrentWeatherByCoords' return object above.
    getAirPollution: async (lat, lon) => {
        // Handled in getCurrentWeatherByCoords, returning null to signify "already handled" or generic object
        return null;
    }
};
