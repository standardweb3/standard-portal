export function Arbitrage({ prices, symbols }) {
  const orderMatches = prices?.[0]?.alias === symbols?.[0];
  const [price1, price2] =
    prices.length === 2
      ? orderMatches
        ? prices
        : [prices[1], prices[0]]
      : prices;

  return <div>Arbitrage</div>;
}
