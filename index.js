const API_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_URL = "https://photon.komoot.io/api/";
const DEFAULT_PLACE = { name: "Mangaluru", country: "India", lat: 13, lon: 74.875 };

const DAILY_PARAMS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "precipitation_probability_max",
  "precipitation_sum",
  "wind_speed_10m_max",
  "weathercode",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

// ==== SVG icon set (paths from Lucide, ISC license) ====
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  cloudSun:
    '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  cloudy:
    '<path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"/>',
  fog: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/>',
  drizzle:
    '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/>',
  rain: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>',
  snow: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/>',
  hail: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v2"/><path d="M8 14v2"/><path d="M12 16v2"/><path d="M16 20h.01"/><path d="M8 20h.01"/><path d="M12 22h.01"/>',
  lightning:
    '<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>',
  thermometer: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  droplets:
    '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  sunrise:
    '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  sunset:
    '<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  umbrella:
    '<path d="M22 12a10.06 10.06 1 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
  mapPin:
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  unknown:
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
};

const icon = (name, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ICONS.unknown}</svg>`;

// ==== WMO weather code -> label + icon ====
const weatherFromCode = (code) => {
  if (code === 0) return { label: "Clear sky", icon: "sun" };
  if (code === 1) return { label: "Mainly clear", icon: "cloudSun" };
  if (code === 2) return { label: "Partly cloudy", icon: "cloud" };
  if (code === 3) return { label: "Overcast", icon: "cloudy" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "fog" };
  if (code >= 51 && code <= 55) return { label: "Drizzle", icon: "drizzle" };
  if (code >= 56 && code <= 57) return { label: "Freezing drizzle", icon: "drizzle" };
  if (code >= 61 && code <= 65) return { label: "Rain", icon: "rain" };
  if (code >= 66 && code <= 67) return { label: "Freezing rain", icon: "hail" };
  if (code >= 71 && code <= 75) return { label: "Snowfall", icon: "snow" };
  if (code === 77) return { label: "Snow grains", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "rain" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", icon: "snow" };
  if (code === 95) return { label: "Thunderstorm", icon: "lightning" };
  if (code === 96 || code === 99) return { label: "Thunderstorm with hail", icon: "lightning" };
  return { label: "Unknown", icon: "unknown" };
};

// ==== Helpers ====
const $ = (id) => document.getElementById(id);
const deg = (n) => `${Math.round(n)}°`;
const clock = (iso) => iso.split("T")[1];
const dayName = (iso) => new Date(iso).toLocaleDateString("en-US", { weekday: "long" });
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const showLoader = () => $("loadScreen").classList.add("visible");
const hideLoader = () => $("loadScreen").classList.remove("visible");

const showError = (msg) => {
  const el = $("error");
  el.textContent = msg;
  el.hidden = false;
};
const clearError = () => {
  $("error").hidden = true;
};

// ==== Data fetching ====
const geocode = async (query) => {
  const res = await fetch(`${GEO_URL}?q=${encodeURIComponent(query)}&limit=1`);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;

  const [lon, lat] = feature.geometry.coordinates;
  return {
    lat,
    lon,
    name: feature.properties.name ?? query,
    country: feature.properties.country ?? "",
  };
};

const fetchForecast = async ({ lat, lon }) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: DAILY_PARAMS,
    timezone: "auto",
  });
  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  return res.json();
};

// ==== Rendering ====
const renderHero = (place, d) => {
  const cond = weatherFromCode(d.weathercode[0]);
  const date = new Date(d.time[0]).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  $("main").innerHTML = `
    <div class="hero-info">
      <p class="hero-location">${icon("mapPin", "icon icon-sm")} ${esc(place.name)}${
        place.country ? `, ${esc(place.country)}` : ""
      }</p>
      <p class="hero-date">${date}</p>
      <p class="hero-temp">${deg(d.temperature_2m_max[0])}</p>
      <p class="hero-meta">Feels like ${deg(d.apparent_temperature_max[0])} · H ${deg(
        d.temperature_2m_max[0]
      )} / L ${deg(d.temperature_2m_min[0])}</p>
    </div>
    <div class="hero-cond">
      ${icon(cond.icon, "icon icon-hero")}
      <p class="hero-cond-label">${cond.label}</p>
      <p class="hero-rain">${icon("umbrella", "icon icon-sm")} ${
        d.precipitation_probability_max[0]
      }% chance of rain</p>
    </div>`;
};

const renderConditions = (d) => {
  const tiles = [
    { icon: "thermometer", label: "Real feel", value: deg(d.apparent_temperature_max[0]) },
    { icon: "wind", label: "Wind", value: `${Math.round(d.wind_speed_10m_max[0])} km/h` },
    { icon: "droplets", label: "Rain", value: `${d.precipitation_sum[0]} mm` },
    { icon: "sun", label: "UV index", value: Math.round(d.uv_index_max[0]) },
    { icon: "sunrise", label: "Sunrise", value: clock(d.sunrise[0]) },
    { icon: "sunset", label: "Sunset", value: clock(d.sunset[0]) },
  ];

  $("condition_elements").innerHTML = tiles
    .map(
      (t) => `
      <div class="tile">
        <span class="tile-icon">${icon(t.icon)}</span>
        <div>
          <p class="tile-label">${t.label}</p>
          <p class="tile-value">${t.value}</p>
        </div>
      </div>`
    )
    .join("");
};

const renderForecast = (d) => {
  $("elements").innerHTML = d.time
    .map((t, i) => {
      const cond = weatherFromCode(d.weathercode[i]);
      return `
      <div class="forecast-row">
        <span class="fc-day">${i === 0 ? "Today" : dayName(t)}</span>
        <span class="fc-cond">${icon(cond.icon)}<span>${cond.label}</span></span>
        <span class="fc-temps">${deg(d.temperature_2m_max[i])}<span class="fc-min"> / ${deg(
          d.temperature_2m_min[i]
        )}</span></span>
      </div>`;
    })
    .join("");
};

// ==== Page flow ====
const loadWeather = async (place) => {
  showLoader();
  clearError();
  try {
    const data = await fetchForecast(place);
    renderHero(place, data.daily);
    renderConditions(data.daily);
    renderForecast(data.daily);
  } catch (err) {
    console.error(err);
    showError("Couldn't load the weather. Please try again.");
  } finally {
    hideLoader();
  }
};

$("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = $("search").value.trim();
  if (!query) return;

  showLoader();
  clearError();
  try {
    const place = await geocode(query);
    if (!place) {
      hideLoader();
      showError(`No results found for "${query}".`);
      return;
    }
    $("search").value = "";
    await loadWeather(place);
  } catch (err) {
    console.error(err);
    hideLoader();
    showError("Search failed. Please check your connection and try again.");
  }
});

loadWeather(DEFAULT_PLACE);
