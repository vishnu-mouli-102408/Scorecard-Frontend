import { useState } from "react";
import axios from "axios";
import SearchBox from "../searchResult/SearchBox";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { stockName } from "../../store/selectors/inputStockDetails";
import { inputStockDetails } from "../../store/atoms/inputStockDetails";
import { inputStockSchema } from "../../models/inputStock";

const Input = () => {
  const inputStockName = useRecoilValue(stockName);
  const setStockDetails = useSetRecoilState(inputStockDetails);
  const [results, setResults] = useState<Result>([]);
  const inputStockDetail = useRecoilValue(inputStockDetails);

  const handleChange = (value: string) => {
    setStockDetails((prev) => ({
      ...prev,
      stockName: value,
    }));
    fetchData(value);
  };

  interface ItemTypes {
    country: string;
    currency: string;
    exchange: string;
    mic_code: string;
    name: string;
    symbol: string;
    type: string;
  }

  type Result = ItemTypes[];

  const fetchData = async (name: string) => {
    const response = await axios.get(
      "https://api.twelvedata.com/stocks?exchange=NSE&country=India"
    );

    if (!response) {
      throw new Error("Failed to fetch data");
    }
    const data = response.data.data;
    const result = data.filter((item: ItemTypes) => {
      return (
        (name &&
          item &&
          item.name &&
          item.name.toLowerCase().includes(name.toLowerCase())) ||
        item.symbol.toLowerCase().includes(name.toLowerCase())
      );
    });
    const filteredData = result.slice(0, 10);

    setResults(filteredData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedData = inputStockSchema.safeParse(inputStockDetail);
    if (!validatedData.success) {
      const validationError = validatedData.error.errors;
      console.log(validationError);
    }
    if (validatedData.success) {
      try {
        const response = await axios.post(
         process.env.BACKEND_URL + "/api/v1/stocks",
          validatedData.data
        );
        console.log(response?.data.success);

        if (response?.data.success) {
          setStockDetails({
            stockName: "",
            exchange: "",
            entryType: "",
            current_market_price: 0,
            rate_range: "0",
            target: 0,
            stopLoss: 0,
            validity: 0,
          });
          console.log("Data Posted Successfullt", response.data);
        }
      } catch (error) {
        console.log("Error Occured");
        console.log(error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <div>
              <label
                htmlFor="script_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Script Name
              </label>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.value)
                }
                type="text"
                autoComplete="off"
                id="script_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter a Name..."
                value={inputStockName}
                required
              />
            </div>
            <div>
              <SearchBox results={results} setResults={setResults} />
            </div>
          </div>

          <div>
            <label
              htmlFor="market_price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Current Market Price
            </label>
            <input
              disabled
              type="text"
              id="market_price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a Number..."
              value={inputStockDetail.current_market_price ?? ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="exchange"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Exchange
            </label>
            <select
              id="exchange"
              value={inputStockDetail.exchange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStockDetails((prev) => ({
                  ...prev,
                  exchange: e.target.value,
                }))
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="" disabled>
                Choose an option
              </option>
              <option value="BSE">BSE</option>
              <option value="NSE">NSE</option>
              <option value="MCX">MCX</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="exchange"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Entry Type
            </label>
            <select
              id="entry_type"
              value={inputStockDetail.entryType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStockDetails((prev) => ({
                  ...prev,
                  entryType: e.target.value,
                }))
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="" disabled>
                Choose an option
              </option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="rate_range"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Rate/Range
            </label>
            <input
              type="string"
              onFocus={() => {
                if (inputStockDetail.rate_range === "0") {
                  setStockDetails((prev) => ({
                    ...prev,
                    rate_range: "",
                  }));
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setStockDetails((prev) => ({
                  ...prev,
                  rate_range: e.target.value,
                }));
              }}
              id="rate_range"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a Number..."
              required
              value={
                inputStockDetail.rate_range !== undefined &&
                inputStockDetail.rate_range !== null
                  ? inputStockDetail.rate_range.toString()
                  : ""
              }
            />
          </div>
          <div>
            <label
              htmlFor="target"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Target
            </label>
            <input
              type="number"
              id="target"
              onFocus={() => {
                if (inputStockDetail.target === 0) {
                  setStockDetails((prev) => ({
                    ...prev,
                    target: undefined,
                  }));
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newVal = parseFloat(e.target.value);
                if (!isNaN(newVal)) {
                  setStockDetails((prev) => ({ ...prev, target: newVal }));
                } else {
                  setStockDetails((prev) => ({ ...prev, target: undefined }));
                }
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a Number..."
              required
              value={
                inputStockDetail.target !== undefined &&
                inputStockDetail.target !== null
                  ? inputStockDetail.target.toString()
                  : ""
              }
            />
          </div>
          <div>
            <label
              htmlFor="stoploss"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Stop Loss
            </label>
            <input
              type="number"
              id="stoploss"
              onFocus={() => {
                if (inputStockDetail.stopLoss === 0) {
                  setStockDetails((prev) => ({
                    ...prev,
                    stopLoss: undefined,
                  }));
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newVal = parseFloat(e.target.value);
                if (!isNaN(newVal)) {
                  setStockDetails((prev) => ({ ...prev, stopLoss: newVal }));
                } else {
                  setStockDetails((prev) => ({ ...prev, stopLoss: undefined }));
                }
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a Number..."
              required
              value={inputStockDetail.stopLoss ?? ""}
            />
          </div>
          <div>
            <label
              htmlFor="validity"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Validity in days
            </label>
            <input
              type="number"
              id="validity"
              onFocus={() => {
                if (inputStockDetail.validity === 0) {
                  setStockDetails((prev) => ({
                    ...prev,
                    validity: undefined,
                  }));
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newVal = parseFloat(e.target.value);
                if (!isNaN(newVal)) {
                  setStockDetails((prev) => ({ ...prev, validity: newVal }));
                } else {
                  setStockDetails((prev) => ({ ...prev, validity: undefined }));
                }
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a Number..."
              required
              value={inputStockDetail.validity ?? ""}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Input;
