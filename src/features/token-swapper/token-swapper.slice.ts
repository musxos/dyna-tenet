import Tokens, { InitTokens } from "@/context/tokens";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Token = {
  name: string;
  symbol: string;
  address: string;
  image?: string;
  pairs: string[];
};

export interface TokenSwapperState {
  buyToken?: Token | null;
  sellToken?: Token | null;
  amount: number;
  pairs?: Token[];
}

const initialState: TokenSwapperState = {
  buyToken: InitTokens[0],
  sellToken: InitTokens[2],
  amount: 1,
  pairs: [],
};

export const tokenSwapperSlice = createSlice({
  name: "token-swapper",
  initialState,
  reducers: {
    setBuyToken: (state, action: PayloadAction<Token>) => {
      state.buyToken = action.payload;
    },
    setSellToken: (state, action: PayloadAction<Token>) => {
      state.sellToken = action.payload;
    },
    setSellAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
  },
});

export const { setBuyToken, setSellToken, setSellAmount } =
  tokenSwapperSlice.actions;

export default tokenSwapperSlice.reducer;
