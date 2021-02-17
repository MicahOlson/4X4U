import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Conversion from './services/pair-exchange-api.js';
import { findArbitrage , getExchangeRates, manipulateRates } from './js/arbitrage.js';
import { selectCurrencies } from './js/currency-list.js';

$(document).ready(function() {
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

  // Conversion calculator
  function populateDropdown() {
    for(const key in selectCurrencies()) {
      $("#convertCurrBase").append(`<option value="${key}">${key} - ${selectCurrencies()[key][0]}</option>`);
      $("#convertCurrTarget").append(`<option value="${key}">${key} - ${selectCurrencies()[key][0]}</option>`);
    }
  }
  populateDropdown();
 


  $('#convertRunCalc').click(function(event) {
    event.preventDefault();
    const fromCurrency = $('#convertCurrBase').val();
    const toCurrency = $('#convertCurrTarget').val();
    const amount = parseInt($("#convertCurrAmt").val());
    
    let promise = Conversion.getConversion(fromCurrency, toCurrency);
    promise.then(function(response) {
      const body = JSON.parse(response);
      if (body.result === "success") {
        const symbol = '&#x' + body.target_data.display_symbol.split(',').join(';&#x') + ';'
        $('#convertOutput').html(`Your total amount is ` + symbol + ` ${(amount * body.conversion_rate).toFixed(2)} converting from ${fromCurrency} to ${toCurrency}`);
      }}, function(error) {
      console.log(`API CALL ERROR -> ${error}`);
    });
  });
});
