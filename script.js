'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

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
const getCountryAndNeighbourData = function (country) {
  // old school
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v2/name/${country}`);

  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    renderCountry(data, 'neighbour');
    const neighbour = data.borders?.[0];
    if (!neighbour) return;

    const request2 = new XMLHttpRequest();

    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);

    request2.send();
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);
      renderCountry(data2, 'neighbour');
    });
  });
};

getCountryAndNeighbourData('france');

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
};

getCountryData('portugal');

const lotteryPromise = new Promise(function (resolveF, rejectF) {
  // this function is called executor
  console.log('lotter draw is happening!');
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolveF('YOU WIN!');
    } else {
      rejectF('You lost your money!');
    }
  }, 2000);
});
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  err => console.error(err)
);

console.log(1);
