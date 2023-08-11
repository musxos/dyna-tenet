import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPair } from "@/features/pair/pair.slice";
import { Pool } from "@/features/pool/pool.slice";
import instance from "@/services/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isAddress } from "viem";

export type UsePair = {
  autoFetch: boolean;
  pairAddress?: string | null;
};

export const DEFAULT_ARGUMENTS: UsePair = {
  autoFetch: true,
  pairAddress: null,
};

/**
 * @deprecated
 */
export function usePair({ autoFetch, pairAddress }: UsePair) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.pair);

  useMemo(() => {
    if (!autoFetch || !pairAddress) {
      return;
    }

    if (!isAddress(pairAddress)) {
      return;
    }

    fetchPair(pairAddress);
  }, [pairAddress]);

  async function fetchPair(pairAddress: string) {
    const response = await instance.get("/pair", {
      params: {
        address: pairAddress,
      },
    });

    dispatch(setPair(response.data));

    return response;
  }

  return {
    state,
    fetchPair,
  };
}
