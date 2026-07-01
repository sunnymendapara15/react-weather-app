# React Weather App

This project is a simple React-based weather dashboard built with Vite. It lets you search for any city and view the current weather along with a short forecast powered by the OpenWeatherMap API.

## Features

- Search for current weather by city name
- Displays temperature, humidity, wind speed, sunrise/sunset, and weather conditions
- Shows a short 5-period forecast using the 12:00 PM entries (falls back to the first 5 entries)
- Responsive layout with a dark, modern design

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sunnymendapara15/react-weather-app.git
   cd react-weather-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the provided template and add your OpenWeatherMap API key:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_OPENWEATHER_API_KEY` to your key.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open the URL shown in your terminal (usually http://localhost:5173) to view the app.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – produce an optimized production build
- `npm run preview` – locally preview the production build

## Notes

- The app uses the Vite dev server and requires `VITE_OPENWEATHER_API_KEY` to be defined.
- Forecast data respects the timezone returned by OpenWeatherMap, which is why 12:00 PM snapshots are preferred when available.
