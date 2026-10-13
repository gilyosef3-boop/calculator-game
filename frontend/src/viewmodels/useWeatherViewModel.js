import { useEffect, useRef, useState } from "react";
import { fetchCityWeather } from "../models/weatherApi.js";

const REFRESH_INTERVAL = 10 * 60 * 1000;

export function useWeatherViewModel() {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasData = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(!hasData.current);
    setIsRefreshing(hasData.current);
    setError("");

    fetchCityWeather({ signal: controller.signal })
      .then((weather) => {
        setCities(weather);
        hasData.current = true;
        setUpdatedAt(new Date());
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

    const timer = window.setInterval(() => setRefreshKey((key) => key + 1), REFRESH_INTERVAL);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [refreshKey]);

  const filteredCities = cities.filter((city) =>
    city.city.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  return {
    cities: filteredCities,
    totalCities: cities.length,
    query,
    setQuery,
    error,
    updatedAt,
    isLoading,
    isRefreshing,
    refresh: () => setRefreshKey((key) => key + 1),
  };
}