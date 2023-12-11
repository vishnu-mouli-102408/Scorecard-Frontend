import { atom } from "recoil";
import { StockSchema } from "../../models/inputStock";

export const inputStockDetails = atom<StockSchema>({
  key: "StockDetails",
  default: {
    stockName: "",
    exchange: "",
    entryType: "",
    current_market_price: 0,
    rate_range: "0",
    target: 0,
    stopLoss: 0,
    validity: 0,
  },
});
