import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Arbitrage from './services/standard-exchange-api.js';

$(document).ready(function() { 
  // Arbitrage
  let exchanges = {};
  $('#test').click(function(event) {
    event.preventDefault();
    let topTen = ['USD', 'EUR', 'JPY']; // , 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'
    // let userSelection = "USD" // base value from HTML;
    topTen.forEach(function(base) {
      if (!sessionStorage[base]) {
        let promise = Arbitrage.getArbitrage(base);
        promise.then(function(response) {
          const baseRates = JSON.parse(response);
          exchanges[base] = baseRates;
          sessionStorage.setItem(base, JSON.stringify(baseRates));
        }, function(error) {
          console.log(`API CALL ERROR -> ${error}`);
        });
      } else {
        console.log("Else conditional reached.");
        exchanges[base] = JSON.parse(sessionStorage.getItem(base));
      }
    });
  });
  // findArbitrage(userSelection, exchanges);
});
//console.log(response);