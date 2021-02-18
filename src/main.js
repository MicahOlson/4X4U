import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Conversion from './services/pair-exchange-api.js';
import { selectCurrencies } from './js/currency-list.js';
import { findArbitrage , getExchangeRates } from './js/arbitrage.js';
import { demoRates } from './js/demo-rates.js';


$(document).ready(function() {
  function errorCheck(response) {
    const body = JSON.parse(response);
    if (body.result === "error") {
      $("#error").append(`<p>Sorry! We got the following error: ${body['error-type']}</p>`);
    }
  }

  // Arbitrage
  $('#arbRunCalc').click(function(event) {
    let userCurrency = $('arbBaseCurr').val();
    event.preventDefault();
    // let userAmount = 15 // amount value from user;
    let arbitrageResults = findArbitrage(userCurrency, getExchangeRates());
    if (arbitrageResults.length > 0) { 
      console.log(`BLING!`);
      arbitrageResults.forEach(function(result) {
        console.log(result);
      });
    } else {
      console.log(`Sorry, no arbitrage opportunities found today.`);
      errorCheck();
    }
  });

  $('#runDemo').click(function(event) {
    event.preventDefault();
    let userCurrency = "USD";
    let arbitrageResults = findArbitrage(userCurrency, demoRates);
    if (arbitrageResults.length > 0) { 
      console.log(`BLING!`);
      arbitrageResults.forEach(function(result) {
        console.log(result);
      });
    }
  });

  // Conversion calculator
  function populateDropdown() {
    for(const key in selectCurrencies()) {
      $("#convertCurrBase").append(`<option value="${key}">${key} - ${selectCurrencies()[key][0]}</option>`);
      $("#convertCurrTarget").append(`<option value="${key}">${key} - ${selectCurrencies()[key][0]}</option>`);
    }
  }
  function clearFields() {
    $("#convertCurrBase").val("");
    $("#convertCurrTarget").val("");
    $("#convertCurrAmt").val("");
    $("#error").empty();
  }
  function valueCheck(amount) {
    if (amount <= 0) {
      $("#error").append(`<p>Please enter a valid currency amount.</p>`);
    }
  }


  populateDropdown();

  $('#convert-form').submit(function(event) {
    event.preventDefault();
    const fromCurrency = $('#convertCurrBase').val();
    const toCurrency = $('#convertCurrTarget').val();
    const amount = parseInt($("#convertCurrAmt").val());
    clearFields();
    valueCheck(amount);
    let promise = Conversion.getConversion(fromCurrency, toCurrency);
    promise.then(function(response) {
      const body = JSON.parse(response);
      if (body.result === "success") {
        const symbol = '&#x' + body.target_data.display_symbol.split(',').join(';&#x') + ';';
        $('#convertOutput').html(`Your total amount is ` + symbol + ` ${(amount * body.conversion_rate).toFixed(2)} converting from ${fromCurrency} to ${toCurrency}`);
      } else {
        errorCheck(response);
      }
    }, function(error) {
      $("#error").append(`<p>There was an error processing your request: ${error}</p>`);
    });
  });
});
