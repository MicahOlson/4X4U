import Arbitrage from '../services/standard-exchange-api.js';

const topTen = [
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 
  'CAD', 'CHF', 'CNY', 'SEK', 'NZD'
];
let exchangeRates = {};

function addExchangeRate(base, baseRates) {
  exchangeRates[base] = baseRates.conversion_rates;
  delete exchangeRates[base][base];
}

export function manipulateRates() {
  let i = 0;
  while (i < 2) {
    const random1 = Math.floor(Math.random() * topTen.length);
    const random2 = Math.floor(Math.random() * topTen.length);
    if (random1 != random2) {
      exchangeRates[topTen[random1]][topTen[random2]] += .1;
      i++;
    }
  }
}

export function getExchangeRates() { 
  topTen.forEach(function(base) {
    if (!sessionStorage[base]) {
      let promise = Arbitrage.getArbitrage(base);
      promise.then(function(response) {
        const baseRates = JSON.parse(response);
        sessionStorage.setItem(base, JSON.stringify(baseRates));
        addExchangeRate(base, baseRates);
      }, function (error) {
        console.log(`API CALL ERROR -> ${error}`);
      });
    } else {
      let baseRates = sessionStorage.getItem(base);
      baseRates = JSON.parse(baseRates);
      addExchangeRate(base, baseRates);
    }
  });
}

export function findArbitrage(baseCurrency) {
  let firstExchange = {};
  for (const base in exchangeRates) {
    for (const firstTarget in exchangeRates[base]) {
      firstExchange[`${base}->${firstTarget}`] = exchangeRates[base][firstTarget];
    }
  }

  let secondExchange = {};
  for (const key in firstExchange) {
    const exchanges = key.split('->');
    for (const secondTarget in exchangeRates[exchanges[1]]) {
      secondExchange[`${key}->${secondTarget}`] = firstExchange[key] * exchangeRates[exchanges[1]][secondTarget];
    }
  }

  let thirdExchange = {};
  for (const key in secondExchange) {
    const exchanges = key.split('->');
    for (const thirdTarget in exchangeRates[exchanges[2]]) {
      thirdExchange[`${key}->${thirdTarget}`] = secondExchange[key] * exchangeRates[exchanges[2]][thirdTarget];
    }
  }

  const baseCurr = baseCurrency;
  let cycles = {};
  for (const cycle in thirdExchange) {
    const exchanges = cycle.split('->');
    if (exchanges[0] === baseCurr && exchanges[3] === baseCurr) {
      cycles[cycle] = thirdExchange[cycle];
    }
  }
  
  let arbitrageResults = [];
  for (const cycle in cycles) {
    if (cycles[cycle] > 1.01) {
      arbitrageResults.push(`${cycle}: ${cycles[cycle]}`);
    }
  }
  
  return arbitrageResults; // returns an array of arbitrage opportunities
}
