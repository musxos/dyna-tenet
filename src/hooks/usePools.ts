import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPools } from "@/features/pool/pool.slice";
import instance from "@/services/axios";
import { useEffect } from "react";

export type UsePoolsArguments = {
  autoFetch: boolean;
};

export function usePools({ autoFetch }: UsePoolsArguments) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.pool);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchPools();
  }, []);

  async function fetchPools() {
    const response = await instance.get("/fetchdata");

    dispatch(setPools(response.data));

    return response;
  }

  return {
    state,
    dispatch,
    fetchPools,
  };
}
