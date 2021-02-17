import Arbitrage from '../services/standard-exchange-api.js';

// Top ten currencies traded on forex market
const currencies = [
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 
  'CAD', 'CHF', 'CNY', 'SEK', 'NZD'
];
// All available currencies
// const currencies = [
//   'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 
//   'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 
//   'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 
//   'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 
//   'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 
//   'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 
//   'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 
//   'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 
//   'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 
//   'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 
//   'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 
//   'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 
//   'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 
//   'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 
//   'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 
//   'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'
// ];

export function getExchangeRates() { 
  let rates = {};
  currencies.forEach(function(base) {
    if (!sessionStorage[base]) {
      let promise = Arbitrage.getArbitrage(base);
      promise.then(function(response) {
        const baseRates = JSON.parse(response);
        sessionStorage.setItem(base, JSON.stringify(baseRates));
        rates[base] = baseRates.conversion_rates;
        delete rates[base][base];
      }, function (error) {
        console.log(`API CALL ERROR -> ${error}`);
      });
    } else {
      let baseRates = sessionStorage.getItem(base);
      baseRates = JSON.parse(baseRates);
      rates[base] = baseRates.conversion_rates;
      delete rates[base][base];
    }
  });
  return rates;
}

export function findArbitrage(baseCurrency, exchangeRates) {
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
