import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    cardCountryInfo: document.querySelector('.country-info'), 
    cardCountryList: document.querySelector('.country-list'), 
} 

refs.input.addEventListener('input', debounce(onInputSerch, DEBOUNCE_DELAY));

function onInputSerch(e) {
    e.preventDefault();
    const sercQuery = e.target.value;
    console.log(sercQuery);
    fetchCountries(sercQuery).then(renderCountryCard).catch(onError);
    }

function fetchCountries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}`).then(response => {
        return response.json();
    });
}

function renderCountryCard(country) {
    console.log(country);
    if (country.length === 1) {
        clearMarkup();
        createCountryMarkup(country);
    } else if (country.length <= 10) {
        clearMarkup();
        createListCountryMarkup(country);
    }
    else if (country.length > 10) {
         clearMarkup()
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    }
}

function createListCountryMarkup(country) {
    const markup = country.map(({ flags, name }) =>
        `<li><img src="${flags.svg}" alt="${name.common}" width=40px, height = 30px >${name.common}</li>`
    );
    
    refs.cardCountryInfo.innerHTML = markup;
};
    


function createCountryMarkup(country) {
    const markup = country.map(({ flags, name, capital, population, languages }) => 
    `<h1><img src="${flags.png}" alt="${name.common}" width=40px, height = 30px>${name.common}</h1>
    <p>Capital: <span>${capital}</span></p>
    <p>Population: <span>${population}</span></p>
    <p>Languages: <span>${Object.values(languages).join(', ')}</span></p>`
    );

     refs.cardCountryList.innerHTML = markup;
}

function clearMarkup() {
    refs.cardCountryInfo.innerHTML = '';
    refs.cardCountryList.innerHTML = '';
}

function onError() {
    clearMarkup();
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
}