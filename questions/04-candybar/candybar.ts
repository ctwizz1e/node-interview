const COST_DOLLAR = 1;
const COST_WRAPPER = 3;

/**
 * I can buy a candy bar for $1 or 3 candy bar wrappers. Write a function
 * that takes at least 1 argument, dollars, and outputs the number of candy
 * bars I could buy
 */
export function buyCandyBars(
  dollars: number,
  wrappers: number = 0,
  round: number = 0
): number {
  // exit condition - if no resources left, game over
  if (dollars === 0 && wrappers === 0) {
    console.log(`zero end in round ${round}`);
    return 0;
  }
  // how many you can buy with dollars
  const candyBarsFromDollars = Math.floor(dollars / COST_DOLLAR);
  const remainderDollars = dollars % COST_DOLLAR;
  // how many you can convert from wrappers back to dollars
  const totalCandyBarWrappers = wrappers + candyBarsFromDollars; // for each bar you bought, you have one wrapper
  const dollarsFromWrappers = Math.floor(totalCandyBarWrappers / COST_WRAPPER);
  const remainderWrappers = totalCandyBarWrappers % COST_WRAPPER;
  // exit condition - if not enough resources to get any candy bars, game over
  if (candyBarsFromDollars === 0 && dollarsFromWrappers === 0) {
    console.log(`non-zero end in round ${round}`, { dollars, wrappers });
    return 0;
  }
  // total candy bars from this round
  console.log(`round ${round}`, {
    dollars,
    wrappers,
    candyBarsFromDollars,
    dollarsFromWrappers,
    remainderDollars,
    remainderWrappers,
  });
  // return total down tree plus candy from this round
  const totalBarsFromNextRound = buyCandyBars(
    dollarsFromWrappers + remainderDollars,
    remainderWrappers,
    round + 1
  );
  return totalBarsFromNextRound + candyBarsFromDollars;
}
