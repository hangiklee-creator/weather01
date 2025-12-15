const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''; // Will configure this next
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Invalid API Key. Please check your .env file.");
        }
        if (response.status === 404) {
            throw new Error("City not found. Please check the spelling.");
        }
        throw new Error("Weather service error");
    }
    return response.json();
};

export const weatherService = {
    getCurrentWeather: async (city, lang = 'en') => {
        if (!API_KEY) throw new Error("API Key is missing");
        const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&lang=${lang}&appid=${API_KEY}`);
        return handleResponse(response);
    },

    getForecast: async (city, lang = 'en') => {
        if (!API_KEY) throw new Error("API Key is missing");
        const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&lang=${lang}&appid=${API_KEY}`);
        return handleResponse(response);
    },

    getAirPollution: async (lat, lon) => {
        if (!API_KEY) throw new Error("API Key is missing");
        const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        return handleResponse(response);
    },

    searchCities: async (query) => {
        if (!API_KEY) throw new Error("API Key is missing");
        // Limit to 10 results to include smaller cities like Sokcho, Gangneung
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`);
        return handleResponse(response);
    },

    getCurrentWeatherByCoords: async (lat, lon, lang = 'en') => {
        if (!API_KEY) throw new Error("API Key is missing");
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${API_KEY}`);
        return handleResponse(response);
    },

    getForecastByCoords: async (lat, lon, lang = 'en') => {
        if (!API_KEY) throw new Error("API Key is missing");
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${API_KEY}`);
        return handleResponse(response);
    }
};
