export enum CandlePeriod {
  FiveMinutes = 5 * 60,
  FifteenMinutes = 15 * 60,
  OneHour = 60 * 60,
  FourHours = 4 * 60 * 60,
  OneDay = 24 * 60 * 60,
  OneWeek = 7 * 24 * 60 * 60,
}

export interface RawCandlestickDatum {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  token0?: string;
  token1?: string;
}

export interface NumericalCandlestickDatum {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  token0?: string;
  token1?: string;
}

export interface RechartPriceDatum {
  timestamp: number;
  price: number;
  token0?: string;
  token1?: string;
}
