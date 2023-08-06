import instance from "@/services/axios";
import { useMemo, useState } from "react";

export function usePairTransactions(
  tokenName: string,
  targetTokenName: string,
) {
  const [pairTransactions, setPairTransactions] = useState<any[]>([]);

  async function fetchPairTransactions() {
    const response = await instance
      .get(`lastdaypair/${tokenName}-${targetTokenName}`)
      .catch((error) => {
        console.error(error);

        return {
          data: [],
        };
      });
    return response.data.map((item: any) => {
      return {
        ...item,
        date: new Date(item.date),
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
  }, [tokenName, targetTokenName]);

  return {
    fetchPairTransactions,
    pairTransactions,
    setPairTransactions,
  };
}
