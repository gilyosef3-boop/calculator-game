import asyncio
import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from httpx import AsyncClient, HTTPError
from pydantic import BaseModel

MET_NO_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact"
MET_NO_USER_AGENT = os.getenv("MET_NO_USER_AGENT", "IsraelCityWeather/1.0")
WEATHER_CITIES = (
    ("Jerusalem", 31.7683, 35.2137),
    ("Tel Aviv", 32.0853, 34.7818),
    ("Haifa", 32.7940, 34.9896),
    ("Beersheba", 31.2518, 34.7913),
    ("Eilat", 29.5577, 34.9519),
    ("Nazareth", 32.6996, 35.3035),
    ("Ashdod", 31.8044, 34.6553),
    ("Tiberias", 32.7922, 35.5312),
)

app = FastAPI(title="Israel City Weather", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


class CityWeather(BaseModel):
    city: str
    temperature_c: float
    temperature_f: float
    weather_symbol: str
    observed_at: str


async def fetch_city_weather(
    client: AsyncClient, city: str, latitude: float, longitude: float
) -> CityWeather:
    response = await client.get(
        MET_NO_URL,
        params={"lat": latitude, "lon": longitude},
    )
    response.raise_for_status()
    forecast: dict[str, Any] = response.json()["properties"]["timeseries"][0]
    temperature_c = float(forecast["data"]["instant"]["details"]["air_temperature"])
    next_hours = forecast["data"].get("next_1_hours") or forecast["data"].get("next_6_hours") or {}
    weather_symbol = next_hours.get("summary", {}).get("symbol_code", "cloudy")

    return CityWeather(
        city=city,
        temperature_c=round(temperature_c, 1),
        temperature_f=round((temperature_c * 9 / 5) + 32, 1),
        weather_symbol=str(weather_symbol),
        observed_at=str(forecast["time"]),
    )


@app.get("/api/weather", response_model=list[CityWeather])
async def get_weather() -> list[CityWeather]:
    try:
        async with AsyncClient(
            timeout=15.0,
            headers={"User-Agent": MET_NO_USER_AGENT},
        ) as client:
            return list(
                await asyncio.gather(
                    *(
                        fetch_city_weather(client, city, latitude, longitude)
                        for city, latitude, longitude in WEATHER_CITIES
                    )
                )
            )
    except (HTTPError, KeyError, TypeError, ValueError) as error:
        raise HTTPException(
            status_code=502,
            detail="Weather data is temporarily unavailable from MET Norway. Please try again.",
        ) from error


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}