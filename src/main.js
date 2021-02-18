import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Conversion from './services/pair-exchange-api.js';
import { selectCurrencies } from './js/currency-list.js';
import { findArbitrage, getExchangeRates } from './js/arbitrage.js';
import { demoRates } from './js/demo-rates.js';

$(document).ready(function() {
  function errorCheck(response) {
    const body = JSON.parse(response);
    if (body.result === "error") {
      $("#error").append(`<p>Sorry! We got the following error: ${body['error-type']}</p>`);
    }
  }


  // Arbitrage
  $('#arbitrage-form').submit(function(event) {
    event.preventDefault();
    let userCurrency = $('#arbBaseCurr').val();
    let userAmount = $('#arbCurrAmt').val();
    let arbitrageResults = findArbitrage(userCurrency, getExchangeRates());
    if (arbitrageResults.length > 0) {
      const randomResult = arbitrageResults[Math.floor(Math.random() * arbitrageResults.length)];
      const splitResult = randomResult.split('->');
      // const curr1Name = splitResult[1];
      const curr1Val = (parseFloat(splitResult[0]) * userAmount).toFixed(2);
      const curr2Name = splitResult[3];
      const curr2Val = (parseFloat(splitResult[2]) * userAmount).toFixed(2);
      const curr3Name = splitResult[5];
      const curr3Val = (parseFloat(splitResult[4]) * userAmount).toFixed(2);
      const curr4Val = (parseFloat(splitResult[6]) * userAmount).toFixed(2);
      $('#currOne').text(curr1Val);
      $('#currNameTwo').text(curr2Name);
      $('#currTwo').text(curr2Val);
      $('#currNameThree').text(curr3Name);
      $('#currThree').text(curr3Val);
      $('#currFour').text(curr4Val);
      $('#runDemo').hide();
      $('#arbOutput').hide();
      $('#arbOutput').text(`Congratulations—you've found an arbitrage opportunity! See the tiles above for the currency exchange you can make to exploit the market.`);
      clearFields();
      $("#arbitrageSpinner").show().delay(2500).fadeOut();
      setTimeout(function() { $("#arbOutput").show(); }, 3000);
    } else {
      clearFields();
      $('#arbOutput').hide();
      $('#arbOutput').text(`Sorry, no arbitrage opportunities found today.`);
      $("#arbitrageSpinner").show().delay(2500).fadeOut();
      setTimeout(function() { $("#arbOutput").show(); }, 3000);
    }
  });

  $('#runDemo').click(function(event) {
    event.preventDefault();
    const userCurrency = "USD";
    const arbitrageResults = findArbitrage(userCurrency, demoRates);
    const randomResult = arbitrageResults[Math.floor(Math.random() * arbitrageResults.length)];
    const splitResult = randomResult.split('->');
    // const curr1Name = splitResult[1];
    const curr1Val = (parseFloat(splitResult[0]) * 1000).toFixed(2);
    const curr2Name = splitResult[3];
    const curr2Val = (parseFloat(splitResult[2]) * 1000).toFixed(2);
    const curr3Name = splitResult[5];
    const curr3Val = (parseFloat(splitResult[4]) * 1000).toFixed(2);
    const curr4Val = (parseFloat(splitResult[6]) * 1000).toFixed(2);
    $('#currOne').text(curr1Val);
    $('#currNameTwo').text(curr2Name);
    $('#currTwo').text(curr2Val);
    $('#currNameThree').text(curr3Name);
    $('#currThree').text(curr3Val);
    $('#currFour').text(curr4Val);
    $('#demoOutput').html('<img style="height:100%" id="moneymoneymoney" src="https://64.media.tumblr.com/763175ae4f21757ec3f9a5f61047101b/tumblr_opkdjuZbAj1tkodheo5_400.gif" />');
  });

  // Conversion calculator
  function populateDropdown() {
    for (const key in selectCurrencies()) {
      $(".dropdown").append(`<option value="${key}">${key} - ${selectCurrencies()[key][0]}</option>`);
    }
  }

  function clearFields() {
    $("#convertCurrBase").val("");
    $("#convertCurrTarget").val("");
    $("#convertCurrAmt").val("");
    $('#arbBaseCurr').val("");
    $('#arbCurrAmt').val("");
    $("#error").empty();
  }


  populateDropdown();

  $('#convert-form').submit(function(event) {
    event.preventDefault();
    const fromCurrency = $('#convertCurrBase').val();
    const toCurrency = $('#convertCurrTarget').val();
    const amount = parseInt($("#convertCurrAmt").val());
    clearFields();
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