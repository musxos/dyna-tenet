import { useContext, useMemo, useState } from "react";
import { SwapperChainButtonType } from ".";
import Modal from "../modal";
import { SwapperChainListButton } from "./swapper-chain-list-button";
import { fetchCustomToken } from "@/hooks/fetchCustomToken";
import { isAddress } from "viem";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import Tokens from "@/context/tokens";
import { getAllPairs } from "@/hooks/getAllPairs";

export type SwapperChainButtonProps = {
  type: SwapperChainButtonType;
  centered?: boolean;
};

export function SwapperChainButton(props: SwapperChainButtonProps) {
  const tokenSwapper = useTokenSwapper();
  const [open, setOpen] = useState(false);
  const { tokens, pushToken } = useContext(Tokens);

  const handleSearchInput = async (e: any) => {
    e.preventDefault();

    const address = e.target.value;

    if (!isAddress(address)) {
      return;
    }

    const data = await fetchCustomToken(address);

    if (tokens.some((token) => token.address === address)) {
      return tokens.find((token) => token.address === address);
    }

    const result = await getAllPairs(address);

    pushToken({
      address: address,
      image: "image.png",
      name: String(data[2].result),
      symbol: String(data[0].result),
      isError: result.isError,
      pairs: result.pairs,
    } as any);
  };

  useMemo(() => {
    setOpen(false);
  }, [tokenSwapper.tokenSwapper.buyToken, tokenSwapper.tokenSwapper.sellToken]);

  return (
    <>
      <Modal
        className="w-[32rem] bg-white shadow rounded-2xl py-8"
        open={open}
        setOpen={setOpen}
      >
        <div className="flex justify-between px-6 ">
          <h1 className="text-lg text-black font-medium">Select a token</h1>

          <svg
            onClick={() => setOpen(false)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#7E87A1"
            className="w-5 h-5 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="mt-6 px-6">
          <div className="flex items-center px-4 py-3 gap-3 border border-[#C9C9C9] rounded-[12px] w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-[#777777]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              onChange={handleSearchInput}
              className="bg-transparent outline-none w-full h-full"
              placeholder="Search name or paste address"
              type="text"
            />
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-4">
          {(props.type == SwapperChainButtonType.Buy
            ? tokens.filter(
                (x) =>
                  x.address != tokenSwapper.tokenSwapper.buyToken?.address &&
                  x.address != tokenSwapper.tokenSwapper.sellToken?.address,
              )
            : tokens.filter(
                (x) =>
                  x.address != tokenSwapper.tokenSwapper.sellToken?.address &&
                  x.address != tokenSwapper.tokenSwapper.buyToken?.address,
              )
          ).map((token) => {
            return (
              <SwapperChainListButton
                key={token.address}
                token={token}
                type={props.type}
              ></SwapperChainListButton>
            );
          })}
        </div>
      </Modal>
      <button
        onClick={() => setOpen(true)}
        className={
          "flex items-center gap-2 right-3 absolute bg-[#F3F4F6] rounded-[9px] px-2 py-2 active:scale-95 transition " +
          (props.centered ? "top-1/2 -translate-y-1/2" : "top-2")
        }
      >
        <img
          className="w-[22px] h-[22px] rounded-full bg-secondary"
          src={
            (props.type == SwapperChainButtonType.Buy
              ? tokenSwapper.tokenSwapper.buyToken
              : tokenSwapper.tokenSwapper.sellToken
            )?.image
          }
          alt=""
        />

        <span className="text-black font-inter font-medium text-sm">
          {
            (props.type == SwapperChainButtonType.Buy
              ? tokenSwapper.tokenSwapper.buyToken
              : tokenSwapper.tokenSwapper.sellToken
            )?.symbol
          }
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3 h-3 stroke-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
    </>
  );
}
