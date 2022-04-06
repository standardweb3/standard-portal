export const getBuyUrl = (inputCurrency, outputCurrency) => {
  return `/trade/buy?inputCurrency=${inputCurrency.address}&outputCurrency=${outputCurrency.address}`;
};
