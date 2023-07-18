import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Pool } from "../pool/pool.slice";

export interface PairState {
  pair?: Pool | null;
}

const initialState: PairState = {
  pair: null,
};

export const pairSlice = createSlice({
  name: "pair",
  initialState,
  reducers: {
    setPair(state, action: PayloadAction<Pool>) {
      state.pair = action.payload;
    },
  },
});

export const { setPair } = pairSlice.actions;

export default pairSlice.reducer;
