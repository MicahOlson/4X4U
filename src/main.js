import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Arbitrage from './services/standard-exchange-api.js';

$(document).ready(function() { 
  // Arbitrage
  $('#test').click(function(event) {
    event.preventDefault();
    let topTen = ['USD', 'EUR', 'JPY']; // , 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'
    // let userCurrency = "USD" // base value from HTML;
    // let userAmount = 15 // amount value from HTML;
    topTen.forEach(function(base) {
      if (!sessionStorage[base]) {
        let promise = Arbitrage.getArbitrage(base);
        promise.then(function(response) {
          const baseRates = JSON.parse(response);
          sessionStorage.setItem(base, JSON.stringify(baseRates));
        }, function(error) {
          console.log(`API CALL ERROR -> ${error}`);
        });
      }
    });
  });
  // findArbitrage(userSelection, exchanges);
});

