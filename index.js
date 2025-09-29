import { mockData } from "./mock_data.js";
const url = "https://api.open-meteo.com/v1/forecast";

// **** convering location to cordinates ***
const getCordinates = async (location) => {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].geometry.coordinates;
    return [lat, lon];
  } else {
    alert("⚠ Location not found.");
    return null;
  }
};

const searchQuery = [
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

// # Fetching the API
const fetchFromAPI = async (url, [lat, lon]) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: searchQuery,
    timezone: "auto",
  });

  const fullUrl = `${url}?${params}`;
  const response = await fetch(fullUrl);
  const data = await response.json();
  console.log(data);
  return data;
};
const showLoader = () => {
  document.getElementById("loadScreen").style.display = "flex";
};
const hideLoader = () => {
  document.getElementById("loadScreen").style.display = "none";
};
const updateUi = (data) => {
  // ***** Destructuring Data *****
  const {
    daily: {
      precipitation_sum: rain,
      temperature_2m_max: max_temp,
      temperature_2m_min: min_temp,
      uv_index_max: uv,
      apparent_temperature_max: realFeel_max,
      apparent_temperature_min: realFeel_min,
      precipitation_probability_max: chanceOfRain,
      wind_speed_10m_max: windSpeed,
      time,
      weathercode,
      sunrise,
      sunset,
    },
  } = data;

  // ****** Converts the date to day*******
  const dateConversion = (time) => {
    const options = { weekday: "long" };
    const day = new Date(time).toLocaleDateString("en-US", options);
    return day;
  };

  // ***** Conversion of weathercode to name *****
  const weathercodeConversion = (code) => {
    if (code === 0) return { name: "Clear sky", icon: "☀️" };
    if (code === 1) return { name: "Mainly clear", icon: "🌤️" };
    if (code === 2) return { name: "Partly cloudy", icon: "⛅" };
    if (code === 3) return { name: "Overcast", icon: "☁️" };

    if (code === 45) return { name: "Fog", icon: "🌫️" };
    if (code === 48) return { name: "Depositing rime fog", icon: "🌫️" };

    if (code >= 51 && code <= 55) return { name: "Drizzle", icon: "🌦️" };
    if (code >= 56 && code <= 57)
      return { name: "Freezing drizzle", icon: "🌧️❄️" };

    if (code >= 61 && code <= 65) return { name: "Rain", icon: "🌧️" };
    if (code >= 66 && code <= 67)
      return { name: "Freezing rain", icon: "🌧️❄️" };

    if (code >= 71 && code <= 75) return { name: "Snow fall", icon: "🌨️" };
    if (code === 77) return { name: "Snow grains", icon: "🌨️" };

    if (code >= 80 && code <= 82) return { name: "Rain showers", icon: "🌦️" };
    if (code >= 85 && code <= 86) return { name: "Snow showers", icon: "❄️" };

    if (code === 95) return { name: "Thunderstorm", icon: "⛈️" };
    if (code === 96 || code === 99)
      return { name: "Thunderstorm with hail", icon: "⛈️🌩️" };

    return { name: "Unknown", icon: "❓" };
  };

  // ********** generating a weather card*********
  const weatherCard = ({ options = {} }) => {
    let weatherHtml2 = "";

    for (let i = 0; i < (options.itemlength || time.length); i++) {
      const tempDiff = (+(max_temp?.[i] + min_temp?.[i]) / 2).toFixed(2);
      const realfeelDiff = (
        +(realFeel_max?.[i] + realFeel_min?.[i]) / 2
      ).toFixed(2);

      const mainSection = options.main
        ? `<div class="hero">
        <div class="hero_box">
            <h2>${(
              document.getElementById("search").value || "Mangaluru"
            ).toUpperCase()}</h2>
            <h5>chance of Rain: ${chanceOfRain[i]}%</h5>
            <h2>${realfeelDiff}°C</h2>
        </div>
           <span>
            <p>${weathercodeConversion(weathercode[i]).icon}</p>
            <p>${weathercodeConversion(weathercode[i]).name}</p>
           </span>
         </div>`
        : " ";
      //******  clearing the input filed after main section logs****
      document.getElementById("search").value = "";
      const day = i == 0 ? "Today" : dateConversion(time[i]);
      const IconSection = options.icons
        ? `
      <div class="icons" >
      <h5>${day}</h5>
      <span>
      <p>${weathercodeConversion(weathercode[i]).icon}</p>
      <p>${tempDiff}°C</p>
      </span>
      </div> `
        : "";

      const extraSection = options.extra
        ? `<div class="extra">
        <span><p>🌡️ Avg Temp: </p><p>${tempDiff} °C</p></span>
        <span><p>☔ rain: </p><p>${rain?.[i] ?? "?"} mm </p></span>
        <span><p>🌫 Wind: </p><p>${windSpeed?.[i] ?? "?"} km/h</p></span>
        <span><p>🌞 UV: </p><p>${uv?.[i] ?? "?"}</p></span>
        <span><p>🌇 Sunrise: </p><p>${
          sunrise?.[i].split("T")[1] ?? "?"
        }</p></span>
        <span><p>🌆 Sunset: </p><p>${
          sunset?.[i].split("T")[1] ?? "?"
        }</p></span>
         </div>`
        : "";

      weatherHtml2 += `
      ${mainSection}
      ${IconSection}
      ${extraSection}
    `;
    }
    return weatherHtml2;
  };
  // ******* updating the HTML ******
  const mainSection = document.getElementById("main");

  mainSection.innerHTML = weatherCard({
    options: {
      main: true,
      icons: false,
      extra: false,
      itemlength: 1,
    },
  });

  const ConditionSection = document.getElementById("condition_elements");
  ConditionSection.innerHTML = weatherCard({
    options: {
      main: false,
      icons: false,
      extra: true,
      itemlength: 1,
    },
  });
  const fore_cast_container = document.getElementById("elements");
  fore_cast_container.innerHTML = weatherCard({
    options: {
      main: false,
      icons: true,
      extra: false,
    },
  });
};
// **** fetching coordinates  ****
const searchCordinate = () => {
  showLoader();

  const location = document.getElementById("search").value;
  getCordinates(location).then((cords) => {
    if (cords) {
      fetchFromAPI(url, cords).then((data) => {
        updateUi(data);
        hideLoader();
      });
    } else {
      console.warn("Could not get coordinates for the location.");
    }
  });
};
// *** Search Functionality *****
document.getElementById("searchBtn").addEventListener("click", searchCordinate);

// ****** on launch default *****
showLoader();
let lat, lon;
fetchFromAPI(url, [(lat = 13), (lon = 74.875)]).then((data) => {
  updateUi(data);
  hideLoader();
});
// updateUi(mockData);
