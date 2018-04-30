export interface Currency {

  id?: string;

  name: string;
  symbol: string;
  rank: number;
  price_usd: number;
  // volume_usd_24h: number; API has this wrong way :)
  market_cap_usd: number;
  available_supply: number;
  total_supply: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;

  last_updated?: number;

};