import Arbitrage from '../services/standard-exchange-api.js';

const currencies = [
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 
  'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 
  'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 
  'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 
  'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 
  'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 
  'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 
  'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 
  'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 
  'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 
  'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 
  'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 
  'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 
  'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 
  'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'
];

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
      }, function(error) {
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
  let arbitrage = [];
  for (const target1 in exchangeRates[baseCurrency]) {
    for (const target2 in exchangeRates[target1]) {
      if (target2 != baseCurrency) {
        const rateBaseToTarget1 = exchangeRates[baseCurrency][target1];
        const rateTarget1ToTarget2 = exchangeRates[target1][target2];
        const rateTarget2ToBase = exchangeRates[target2][baseCurrency];
        if ((rateBaseToTarget1 * rateTarget1ToTarget2 * rateTarget2ToBase) > 1.01) {
          arbitrage.push([
            1, baseCurrency, 
            rateBaseToTarget1, target1, 
            (rateBaseToTarget1 * rateTarget1ToTarget2), target2, 
            (rateBaseToTarget1 * rateTarget1ToTarget2 * rateTarget2ToBase), baseCurrency
          ]);
        }
      }
    }
  }
  return arbitrage;
}
