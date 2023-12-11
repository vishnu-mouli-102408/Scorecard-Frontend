import { selector } from "recoil";
import { inputStockDetails } from "../atoms/inputStockDetails";

export const stockName = selector({
  key: "StockName",
  get: ({ get }) => {
    const state = get(inputStockDetails);
    if (state.stockName) {
      return state.stockName;
    }
    return "";
  },
});
