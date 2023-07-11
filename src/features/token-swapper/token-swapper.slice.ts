import { Tokens } from "@/app/constant/tokens";
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
  buyToken: Tokens[0],
  sellToken: Tokens[2],
  amount: 0,
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
      state.pairs = action.payload.pairs.map(
        (pair) => Tokens.find((token) => token.address === pair) as Token,
      );

      state.buyToken = state.pairs[0];
    },
    setSellAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
  },
});

export const { setBuyToken, setSellToken, setSellAmount } =
  tokenSwapperSlice.actions;

export default tokenSwapperSlice.reducer;
