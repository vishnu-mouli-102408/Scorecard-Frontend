import { useSetRecoilState } from "recoil";
import "./searchResults.css";
import { inputStockDetails } from "../../store/atoms/inputStockDetails";
import axios, { AxiosResponse } from "axios";
// import { fetchCurrentMarketPrice } from "../../lib/api";

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

interface ResultsTypes {
  results: Result;
  setResults: React.Dispatch<React.SetStateAction<Result>>;
}

const SearchBox = ({ results, setResults }: ResultsTypes) => {
  const setStockDetails = useSetRecoilState(inputStockDetails);

  const handleClick = async (result: ItemTypes) => {
    let res = `${result.name} - ${result.symbol}`;
    const { data }: AxiosResponse = await axios.get(
      `http://localhost:3001/api/v1/cmp/${result.symbol}`
    );

    setStockDetails((prev) => ({
      ...prev,
      stockName: res,
      current_market_price: data.data,
    }));
    setResults([]);
  };

  return (
    <div className="results-list">
      {results.map((result: ItemTypes, index) => {
        return (
          <div key={index} onClick={() => handleClick(result)}>
            {result.name} - {result.symbol}
          </div>
        );
      })}
    </div>
  );
};

export default SearchBox;
