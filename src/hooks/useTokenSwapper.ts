import {
  Token,
  setBuyToken,
  setSellToken,
  setSellAmount,
  setActionType,
} from "@/features/token-swapper/token-swapper.slice";
import { useAppSelector, useAppDispatch } from "@/app/hooks";

export default function useTokenSwapper() {
  const dispatch = useAppDispatch();
  const tokenSwapper = useAppSelector((state) => state.tokenSwapper);
  return {
    tokenSwapper,
    setBuyToken: (token: Token) => dispatch(setBuyToken(token)),
    setSellToken: (token: Token) => dispatch(setSellToken(token)),
    setActionType: (actionType: "swap" | "order") =>
      dispatch(setActionType(actionType)),
    setAmount: (amount: number) => dispatch(setSellAmount(amount)),
  };
}
