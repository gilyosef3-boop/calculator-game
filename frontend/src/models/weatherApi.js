export async function fetchCityWeather({ signal } = {}) {
  const response = await fetch("/api/weather", { signal });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? "Could not load the weather right now.");
  }
  return response.json();
}