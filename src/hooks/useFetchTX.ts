import instance from "@/services/axios";
import { useEffect, useState } from "react";

export type TX = {
  id: number;
  pair: string;
  maker: string;
  result: {
    Price: number;
    Amount: number;
    Asset: string;
  };
};

export function useFetchTX({ autoFetch = true }) {
  const [tx, setTX] = useState<TX[]>([]);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchTX();
  }, []);

  async function fetchTX() {
    const response = await instance.get("/fetchtx");

    setTX(response.data);

    return response;
  }

  return {
    tx,
    setTX,
    fetchTX,
  };
}
