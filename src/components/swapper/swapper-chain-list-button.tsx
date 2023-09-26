import { useMemo } from "react";
import { SwapperChainButtonType } from ".";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import classNames from "classnames";
import { Token } from "@/features/token-swapper/token-swapper.slice";

export type SwapperChainListButtonProps = {
  token: Token;
  type: SwapperChainButtonType;
};

export function SwapperChainListButton({
  token,
  type,
}: SwapperChainListButtonProps) {
  const tokenSwapper = useTokenSwapper();

  const handleClick = () => {
    if (type == SwapperChainButtonType.Sell) {
      tokenSwapper.setSellToken(token);
    } else {
      tokenSwapper.setBuyToken(token);
    }
  };

  const isSelected = useMemo(() => {
    if (type == SwapperChainButtonType.Sell) {
      return token.address == tokenSwapper.tokenSwapper.sellToken?.address;
    } else {
      return token.address == tokenSwapper.tokenSwapper.buyToken?.address;
    }
  }, [tokenSwapper.tokenSwapper.buyToken, tokenSwapper.tokenSwapper.sellToken]);

  const buttonClass = classNames(
    "flex items-center gap-3 mx-5 px-2 py-2 rounded-2xl text-left",
    {
      "opacity-50": isSelected,
      "hover:bg-gray-100": !isSelected,
    },
  );

  return (
    <button onClick={handleClick} className={buttonClass}>
      <img className="w-8 h-8 rounded-full" src={token.image} alt="" />
      <div className="flex flex-col">
        <h3 className="text-black/80">{token.symbol}</h3>
        <p className="text-black/50 text-sm">{token.name}</p>
      </div>
    </button>
  );
}
