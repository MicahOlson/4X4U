import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import Conversion from './services/pair-exchange-api.js';
import { selectCurrencies } from './js/currency-list.js';
import { findArbitrage, getExchangeRates } from './js/arbitrage.js';
import { demoRates } from './js/demo-rates.js';

function celebrate() {
  var duration = 15 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}

function displayArbitrage(arbitrageResults, amount) {
  let maxReturn = 0;
  let bestResult;
  arbitrageResults.forEach(function(result) {
    if (result[6] > maxReturn) {
      maxReturn = result[6];
      bestResult = result;
    }
  });
  const baseName = bestResult[1];
  const baseVal = (bestResult[0] * amount).toFixed(2);
  const target1Name = bestResult[3];
  const exchange1Val = (bestResult[2] * amount).toFixed(2);
  const target2Name = bestResult[5];
  const exchange2Val = (bestResult[4] * amount).toFixed(2);
  const baseNameReturn = bestResult[7];
  const exchange3Val = (bestResult[6] * amount).toFixed(2);
  $('#baseName').text(baseName);
  $('#baseVal').text(baseVal);
  $('#target1Name').text(target1Name);
  $('#exchange1Val').text(exchange1Val);
  $('#target2Name').text(target2Name);
  $('#exchange2Val').text(exchange2Val);
  $('#baseNameReturn').text(baseNameReturn);
  $('#exchange3Val').text(exchange3Val);
  $('#arbOutput').hide();
  $('#arbOutput').text(`Congratulations—you've found ${arbitrageResults.length} arbitrage opportunities with ${baseName}! The cycle with your best return is below.`);
}

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
    const userCurrency = $('#arbBaseCurr').val();
    const userAmount = $('#arbCurrAmt').val();
    const exchangeRates = getExchangeRates();
    const arbitrageResults = findArbitrage(userCurrency, exchangeRates);
    clearFields();
    if (arbitrageResults.length > 0) {
      $("#arbitrageSpinner").show().delay(2500).fadeOut();
      $('#runDemo').hide();
      setTimeout(function() {displayArbitrage(arbitrageResults, userAmount); }, 3000);
      setTimeout(function() { $("#arbOutput").show(); }, 3000);
      setTimeout(function() {$('#demoOutput').html('<img style="height:100%" id="moneymoneymoney" src="https://64.media.tumblr.com/763175ae4f21757ec3f9a5f61047101b/tumblr_opkdjuZbAj1tkodheo5_400.gif" />'); }, 3000);
      setTimeout(function() {celebrate(); }, 3000);
    } else {
      $('#arbOutput').hide();
      $('#arbOutput').text(`Sorry, no arbitrage opportunities found today.`);
      $("#arbitrageSpinner").show().delay(2500).fadeOut();
      setTimeout(function() { $("#arbOutput").show(); }, 3000);
    }
  });

  $('#runDemo').click(function(event) {
    celebrate();
    event.preventDefault();
    const userCurrency = "USD";
    const userAmount = 1000;
    const arbitrageResults = findArbitrage(userCurrency, demoRates);
    const randomResult = [arbitrageResults[Math.floor(Math.random() * arbitrageResults.length)]];
    displayArbitrage(randomResult, userAmount);
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
        $('#convertOutput').html(`Your total amount is ` + symbol + ` ${(amount * body.conversion_rate).toFixed(2)} converting from ${fromCurrency} to ${toCurrency}`).slideDown();
      } else {
        errorCheck(response);
      }
    }, function(error) {
      $("#error").append(`<p>There was an error processing your request: ${error}</p>`);
    });
  });
});
