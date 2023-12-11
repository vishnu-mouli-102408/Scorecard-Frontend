import { z } from "zod";

export const inputStockSchema = z.object({
  stockName: z.string().trim(),
  exchange: z.string().trim(),
  entryType: z.string().trim(),
  rate_range: z.string(),
  current_market_price: z.number().nullish(),
  target: z.number().nullish(),
  stopLoss: z.number().nullish(),
  validity: z.number().nullish(),
  buyRate: z.string().optional(),
  sellRate: z.number().optional(),
  percentage_P_L: z.number().optional(),
  profit_loss: z.number().optional(),
  startTime: z.string().optional(),
  exitTime: z.string().optional(),
  status: z.string().optional(),
  _id: z.string().optional(),
});

export type StockSchema = z.infer<typeof inputStockSchema>;
