const weather_container = document.querySelector(".weather-side");
const info_container = document.querySelector(".info-components");
const input_field = document.querySelector("input");
const from = document.querySelector("form");

//* This function is taking care about fetching data and error handling
const request_by_city_name = async (e) => {
  e.preventDefault();

  const user_input = input_field.value;
  const error = new Error("Invalid city name");

 
  const api_key = "7fe43ab30dd6e5bd29deef1b521807a1";
  const base_url = "https://api.openweathermap.org/data/2.5/weather";
  const queries = `?q=${user_input}&appid=${api_key}&units=metric`;

  //^ The error handling part
  try {
    const res = await fetch(base_url + queries);
    if (!res.ok) throw error;

    const data = await res.json();
    display_data(data);
  } catch (err) {
    display_error(err);
  }
};

from.addEventListener("submit", request_by_city_name);

//* This function will be called at the beginning of displayData() OR displayError
const reset = (gradient, placeholder) => {
  input_field.value = "";
  input_field.setAttribute("placeholder", placeholder);

  info_container.innerHTML = "";
  weather_container.innerHTML = "";
  from.style.backgroundImage = `var(${gradient})`;
};

//* This function will be called if the status of the response is ok
const display_data = (input) => {
  //^ Reset styles and data fields
  reset("--gradient", "Enter city name");
  weather_container.classList.add("dimensions");

  //^ Destructuring the values we are looking for
  const { main, name, sys, weather, wind } = input;
  const { temp, humidity, pressure } = main;
  const { description, icon } = weather[0];
  const { country } = sys;
  const { speed } = wind;

  //^ Send children to their parents

  weather_container.innerHTML += `
      ${render_date_and_city(name, country)} 
      ${render_weather_status(description, icon, temp)}
`;

  info_container.innerHTML += `
      ${render_weather_details("PRESSURE", pressure, "hPa")}
      ${render_weather_details("HUMIDITY", humidity, "%")}
      ${render_weather_details("WIND", speed, "m/s")}
`;
};

//* This function will be called if the status of the response is NOT ok
const display_error = (input) => {
  reset("--gradient-err", input.message);
  weather_container.classList.remove("dimentions");
};

//* This function will be called when displayData() is called
const render_date_and_city = (name, country) => {
  // ^ Function to format the date
  const formatted_date = (format) =>
    new Date().toLocaleDateString("en-us", format);

  //^ call the function, send the option of formatting with an object, store the returned value in a constant
  const date = formatted_date({
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  //^ call the function, send the option of formatting with an object, store the returned value in a constant
  const day = formatted_date({ weekday: "long" });


  return `<div>
            <h2>${day}</h2>
            <p>${date}</p>
            <p>${name}, ${country}</p>
          </div>
        `;
};

//* This function will be also called when displayData() is called
const render_weather_status = (description, icon, temp) => {
  return `<div>
            <img src="http://openweathermap.org/img/w/${icon}.png"></img>
            <h3>${description}</h3>
            <h1>${temp.toFixed(0)}°C</h1>
          </div>
        `;
};

//* This function will be also called when displayData() is called 
const render_weather_details = (title, value, unit) => {
  return `<div>
            <span>${title}</span>
            <span>${value} ${unit}</span>
          </div>
        `;
};
