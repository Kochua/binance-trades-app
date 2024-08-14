import { TradesContext } from "@/context/TradesProvider";
import { useContext } from "react";

// Custom Hook to use the data
export const useTrades = () => {
  return useContext(TradesContext);
};
