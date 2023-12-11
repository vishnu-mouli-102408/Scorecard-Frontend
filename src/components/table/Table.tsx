import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { StockSchema } from "../../models/inputStock";

const Table = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const stockData = async () => {
    const response: AxiosResponse = await axios.get(
      `${BACKEND_URL}/api/v1/stocks`
    );
    const data = response.data.data;
    return data;
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stockData"],
    queryFn: stockData,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Exchange
            </th>
            <th scope="col" className="px-6 py-3">
              Stock
            </th>
            <th scope="col" className="px-6 py-3">
              TimeStamp
            </th>
            <th scope="col" className="px-6 py-3">
              BUY/SELL
            </th>
            <th scope="col" className="px-6 py-3">
              Buy Rate
            </th>
            <th scope="col" className="px-6 py-3">
              Target
            </th>
            <th scope="col" className="px-6 py-3">
              Stop Loss
            </th>
            <th scope="col" className="px-6 py-3">
              Sell Rate
            </th>
            <th scope="col" className="px-6 py-3">
              Exit Timestamp
            </th>
            <th scope="col" className="px-6 py-3">
              P&L
            </th>
            <th scope="col" className="px-6 py-3">
              % gain/loss
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: StockSchema) => {
            return (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={item._id}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.exchange}
                </th>
                <td className="px-6 py-4">{item.stockName}</td>
                <td className="px-6 py-4">{item.startTime}</td>
                <td className="px-6 py-4">{item.entryType}</td>
                <td className="px-6 py-4">{item.buyRate}</td>
                <td className="px-6 py-4">{item.target}</td>
                <td className="px-6 py-4">{item.stopLoss}</td>
                <td className="px-6 py-4">{item.sellRate}</td>
                <td className="px-6 py-4">{item.exitTime}</td>
                <td className="px-6 py-4">{item.profit_loss}</td>
                <td className="px-6 py-4">{item.percentage_P_L}</td>
                <td className="px-6 py-4">{item.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
