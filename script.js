'use strict';

const apiKey = 'XEigQmWqoYxymrAzD9UphUCrMiAYdDpew5vtobf1';
const searchURL = 'https://developer.nps.gov/api/v1/parks'

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson){

  console.log(responseJson);

  $('#park-results').empty();

  for (let i = 0; i < responseJson.data.length; i++){
    $('#park-results').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].url}</p>
      <p>${responseJson.data[i].addresses[0].line1}</p>
      <p>${responseJson.data[i].addresses[0].line2}</p>
      <p>${responseJson.data[i].addresses[0].line3}</p>
      <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode} </p>
      </li>`
    );
  };

  $('#results').removeClass('hidden');
}

function getParks(state, maxResults = 10){
  //searching by state and max results
  const params = {
    api_key: apiKey,
    stateCode: state,
    limit: maxResults,
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    //note: make sure to use input id
    const searchState = $('#js-state').val();
    const mostResults = $('#js-max-results').val();
    getParks(searchState, mostResults);
  });
};

$(watchForm);