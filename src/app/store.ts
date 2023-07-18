import pairSlice from "@/features/pair/pair.slice";
import poolSlice from "@/features/pool/pool.slice";
import tokenSwapperSlice from "@/features/token-swapper/token-swapper.slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    tokenSwapper: tokenSwapperSlice,
    pool: poolSlice,
    pair: pairSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
