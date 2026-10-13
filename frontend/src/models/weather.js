const conditions = [
  { prefixes: ["clearsky"], label: "Clear sky", icon: "sun", tone: "sunny" },
  { prefixes: ["partlycloudy", "fair"], label: "Partly cloudy", icon: "cloud-sun", tone: "bright" },
  { prefixes: ["cloudy"], label: "Overcast", icon: "cloud", tone: "cloudy" },
  { prefixes: ["fog"], label: "Foggy", icon: "fog", tone: "cloudy" },
  { prefixes: ["lightrain"], label: "Light rain", icon: "drizzle", tone: "rainy" },
  { prefixes: ["rain", "heavyrain"], label: "Rain", icon: "rain", tone: "rainy" },
  { prefixes: ["sleet"], label: "Sleet", icon: "snow", tone: "cold" },
  { prefixes: ["snow"], label: "Snow", icon: "snow", tone: "cold" },
];

export function describeWeather(symbol) {
  const normalized = String(symbol ?? "").split("_")[0];
  if (normalized.includes("thunder")) {
    return { label: "Thunderstorm", icon: "storm", tone: "stormy" };
  }

  return conditions.find((condition) => condition.prefixes.some((prefix) => normalized.startsWith(prefix))) ?? {
    label: "Changing skies",
    icon: "cloud",
    tone: "cloudy",
  };
}

export function formatTemperature(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}