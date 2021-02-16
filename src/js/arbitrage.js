export default function findArbitrage(baseCurrency, exchangeRates) {
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
  
  let arbitrage = [];
  for (const cycle in cycles) {
    if ((cycles[cycle] - 1) > .01) {
      arbitrage.push(`${cycle}: ${cycles[cycle]}`);
    }
  }
  return arbitrage;
}
