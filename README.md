# Israel City Weather

A live weather dashboard for eight major Israeli cities. FastAPI fetches current conditions from [MET Norway's Locationforecast API](https://api.met.no/weatherapi/locationforecast/2.0/documentation) and returns temperatures in Celsius and Fahrenheit. The API is free and does not require a key. The React frontend follows MVVM: `models` handle weather data, `viewmodels` manage screen state, and `views` render the dashboard.

## Requirements

- Python 3.10+
- Node.js 18+
- Internet access for live weather data and Google Fonts

MET Norway asks API clients to identify themselves with a descriptive `User-Agent`. Set `MET_NO_USER_AGENT` to an application name and a contact address when deploying.

## Run everything with one command

From the project root, start both services together:

```bash
npm run dev
```

This command creates the backend virtual environment if needed, installs both the Python and Node dependencies, and launches the FastAPI API and the Vite frontend at the same time.

The API runs at `http://localhost:8000` and the frontend is usually served on `http://localhost:5173`. Browse to `http://localhost:8000/docs` for interactive API documentation.

## API

- `GET /api/weather` returns current conditions for Jerusalem, Tel Aviv, Haifa, Beersheba, Eilat, Nazareth, Ashdod, and Tiberias.
- `GET /api/health` returns the service health status.
