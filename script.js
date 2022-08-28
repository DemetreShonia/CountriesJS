'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const limitText = document.getElementById('01');
const limitText2 = document.getElementById('02');

///////////////////////////////////////
const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
</article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbourData = function (country, withNeighbour) {
  // old school
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v2/name/${country}`);

  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    renderCountry(data, 'Your Country');
    const neighbour = data.borders?.[0];

    if (!neighbour || !withNeighbour) return;

    const getNeighbours = async function () {
      const borders = [...data.borders];

      for (let i = 0; i < borders.length; i++) {
        let nei = borders[i];

        const res = await fetch(`https://restcountries.com/v2/alpha/${nei}`);
        const data = await res.json();
        renderCountry(data, 'neighbour');
      }
    };

    getNeighbours();
  });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(pos => console.log(pos));

let clicked = false;
const whereAmI = function () {
  if (clicked) return;
  clicked = true;

  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
      console.log(`https://geocode.xyz/${lat},${lng}?json=1`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);

      getCountryAndNeighbourData(data.country, true);

      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => {
      limitText.innerHTML = `💥 Sorry, free API limit 💥`;
      limitText2.innerHTML = `💥 Thats why I'm showing my country 💥`;
      getCountryAndNeighbourData('sakartvelo', true);
    });
};

btn.addEventListener('click', whereAmI);

const f = async function (country) {
  // await PROMISE
  const res = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
  fetch(`https://restcountries.eu/rest/v2/name/${country}`).then(
    res => console.log(res) // this two are the same
  );
  const data = await res.json();
};
f('portugal'); // this will be called the last! after everythin
console.log('first');
