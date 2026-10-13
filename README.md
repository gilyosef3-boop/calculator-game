# Israel City Weather

A live weather dashboard for eight major Israeli cities. FastAPI fetches current conditions from [MET Norway's Locationforecast API](https://api.met.no/weatherapi/locationforecast/2.0/documentation) and returns temperatures in Celsius and Fahrenheit. The API is free and does not require a key. The React frontend follows MVVM: `models` handle weather data, `viewmodels` manage screen state, and `views` render the dashboard.

## Requirements

- Python 3.10+
- Node.js 18+
- Internet access for live weather data and Google Fonts

MET Norway asks API clients to identify themselves with a descriptive `User-Agent`. Set `MET_NO_USER_AGENT` to an application name and a contact address when deploying.

## Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`. Browse to `http://localhost:8000/docs` for interactive API documentation.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`). Vite proxies `/api` requests to FastAPI.

## API

- `GET /api/weather` returns current conditions for Jerusalem, Tel Aviv, Haifa, Beersheba, Eilat, Nazareth, Ashdod, and Tiberias.
- `GET /api/health` returns the service health status.
