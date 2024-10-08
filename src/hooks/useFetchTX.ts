import instance from "@/services/axios";
import { useEffect, useState } from "react";
import useTokenSwapper from "./useTokenSwapper";

export type TX = {
  id: number;
  pair: string;
  maker: string;
  date: string;
  result: {
    Price: number;
    Amount: number;
    Asset: string;
  };
};

export function useFetchTX({ autoFetch = true }) {
  const tokenSwapper = useTokenSwapper();
  const [tx, setTX] = useState<TX[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchTX();
  }, [tokenSwapper.tokenSwapper.sellToken]);

  async function fetchTX() {
    setIsLoading(true);

    const response = await instance.get("/fetchtx").catch((err) => {
      console.log(err);

      return {
        data: [],
      };
    });

    setTX(response.data);
    setIsLoading(false);

    return response;
  }

  return {
    tx,
    isLoading,
    setTX,
    fetchTX,
  };
}
