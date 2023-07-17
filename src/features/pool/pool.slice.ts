import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Pool = {
  id: number;
  owner: {
    symbol: string;
    address: string;
    price: number;
    image: string;
  };
  target: {
    symbol: string;
    address: string;
    price: number;
    image: string;
  };
  pool: {
    pairaddress: string;
    liquidity: number;
    apr: number;
    type: string;
    feeApr: number;
    rewardApr: number;
  };
};

export interface PoolState {
  pools: Pool[];
}

const initialState: PoolState = {
  pools: [],
};

export const poolSlice = createSlice({
  name: "pool",
  initialState,
  reducers: {
    setPools(state, action: PayloadAction<Pool[]>) {
      state.pools = action.payload;
    },
  },
});

export const { setPools } = poolSlice.actions;

export default poolSlice.reducer;
