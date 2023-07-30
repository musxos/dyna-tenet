import instance from "@/services/axios";
import { useEffect, useState } from "react";

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
  const [tx, setTX] = useState<TX[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchTX();
  }, []);

  async function fetchTX() {
    setIsLoading(true);

    const response = await instance.get("/fetchtx");

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
