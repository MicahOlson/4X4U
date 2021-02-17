import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
//import Arbitrage from './services/standard-exchange-api.js';
import Conversion from './services/pair-exchange-api.js';


$(document).ready(function() {
  // Arbitrage
  // $('#arbRunCalc').click(function(event) {
  //   event.preventDefault();
  //   let topTen = ['USD', 'EUR', 'JPY']; // , 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'
  //   // let userCurrency = "USD" // base value from HTML;
  //   // let userAmount = 15 // amount value from HTML;
  //   topTen.forEach(function(base) {
  //     if (!sessionStorage[base]) {
  //       let promise = Arbitrage.getArbitrage(base);
  //       console.log(promise)
  //       promise.then(function(response) {
  //         const baseRates = JSON.parse(response);
  //         sessionStorage.setItem(base, JSON.stringify(baseRates));
  //       }, function(error) {
  //         console.log(`API CALL ERROR -> ${error}`);
  //       });
  //     }
  //   });
  // });
  // // findArbitrage(userSelection, exchanges);

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