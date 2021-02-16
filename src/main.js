import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Arbitrage from './services/standard-exchange-api.js';
import findArbitrage from './js/arbitrage.js';

let exchanges = {};
function addCurrency(base, baseRates) {
  exchanges[base] = baseRates.conversion_rates;
  delete exchanges[base][base];
  console.log(exchanges);
}

$(document).ready(function () {
  // Arbitrage
  $('#arbRunCalc').click(function(event) {
    event.preventDefault();
    let topTen = ['USD', 'EUR', 'JPY']; // , 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'
    let userCurrency = "USD"; // base value from HTML;
    // let userAmount = 15 // amount value from HTML;

    topTen.forEach(function(base) {
      if (!sessionStorage[base]) {
        let promise = Arbitrage.getArbitrage(base);
        promise.then(function(response) {
          const baseRates = JSON.parse(response);
          sessionStorage.setItem(base, JSON.stringify(baseRates));
          addCurrency(base, baseRates);
        }, function (error) {
          console.log(`API CALL ERROR -> ${error}`);
        });
      } else {
        let baseRates = sessionStorage.getItem(base);
        baseRates = JSON.parse(baseRates);
        addCurrency(base, baseRates);
      }
    });
    exchanges['USD']['EUR'] = 1.250;
    console.log(`Arbitrage array: ${findArbitrage(userCurrency, exchanges)}`);
  });
});
