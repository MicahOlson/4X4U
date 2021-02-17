import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import { findArbitrage , getExchangeRates, manipulateRates } from './js/arbitrage.js';


$(document).ready(function () {
  // Arbitrage
  $('#arbRunCalc').click(function(event) {
    event.preventDefault();     
    let userCurrency = "USD"; // base currency from user;
    // let userAmount = 15 // amount value from user;
    getExchangeRates(); // 'standard' api call to get top ten rates
    manipulateRates(); // demo: adjust some rates slightly to force arbitrage
    let arbitrageResults = findArbitrage(userCurrency); // find arbitrage for base currency
    if (arbitrageResults.length > 0) { 
      console.log(`BLING!`);
      arbitrageResults.forEach(function(result) {
        console.log(result);
      });
    } else {
      console.log(`Sorry, no arbitrage opportunities found today.`);
    }
  });
});
