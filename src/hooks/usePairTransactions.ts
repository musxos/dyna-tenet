import instance from "@/services/axios";
import { useMemo, useState } from "react";

export function usePairTransactions(
  tokenName: string,
  targetTokenName: string,
  dateRange: "24H" | "1H",
) {
  const [pairTransactions, setPairTransactions] = useState<any[]>([]);

  async function fetchPairTransactions() {
    const path = dateRange == "24H" ? "price24hour" : "price1hour";

    const response = await instance
      .get(`${path}/${tokenName}-${targetTokenName}`)
      .catch((error) => {
        console.error(error);

        return {
          data: [],
        };
      });
    return response.data.map((item: any) => {
      return {
        ...item,
        date: new Date(item.time * 1000),
      };
    });
  }

  useMemo(() => {
    if (!tokenName || !targetTokenName) {
      return;
    }

    fetchPairTransactions().then((data) => {
      setPairTransactions(data);
    });
  }, [tokenName, targetTokenName, dateRange]);

  return {
    fetchPairTransactions,
    pairTransactions,
    setPairTransactions,
  };
}
