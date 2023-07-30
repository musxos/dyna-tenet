import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Modal from "../modal";
import { Tokens } from "@/app/constant/tokens";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import { Token } from "@/features/token-swapper/token-swapper.slice";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";

import { NumberInput } from "intl-number-input";
import { useBalanaceOfV2 } from "@/hooks/useBalanceOf.v2";

const NumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 12,
  maximumSignificantDigits: 12,
});

export enum SwapperChainButtonType {
  Sell,
  Buy,
}

export type SwapperChainButtonProps = {
  type: SwapperChainButtonType;
  centered?: boolean;
};

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

export function SwapperChainButton(props: SwapperChainButtonProps) {
  const tokenSwapper = useTokenSwapper();
  const [open, setOpen] = useState(false);

  useMemo(() => {
    setOpen(false);
  }, [tokenSwapper.tokenSwapper.buyToken, tokenSwapper.tokenSwapper.sellToken]);

  const tokens = (
    props.type == SwapperChainButtonType.Buy
      ? Tokens.filter(
          (x) =>
            x.address != tokenSwapper.tokenSwapper.buyToken?.address &&
            x.address != tokenSwapper.tokenSwapper.sellToken?.address,
        )
      : Tokens.filter(
          (x) => x.address != tokenSwapper.tokenSwapper.sellToken?.address,
        )
  ).map((token) => {
    return (
      <SwapperChainListButton
        key={token.address}
        token={token}
        type={props.type}
      ></SwapperChainListButton>
    );
  });
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
              className="bg-transparent outline-none w-full h-full"
              placeholder="Search name or paste address"
              type="text"
            />
          </div>
        </div>
        <div className="gap-2 mt-4 px-6 hidden">
          <button className="flex items-center pl-2 pr-3 py-1 rounded-md bg-gray-100 text-black/50 active:scale-95 transition">
            <img className="w-6 h-6 rounded-full" src="/eth2.png" alt="" />
            <span className="ml-1 text-sm">ETH</span>
          </button>
          <button className="flex items-center pl-2 pr-3 rounded-md hover:bg-gray-100 transition text-black active:scale-95">
            <img className="w-6 h-6 rounded-full" src="/usdt.webp" alt="" />
            <span className="ml-1 text-sm">ETH</span>
          </button>
          <button className="flex items-center pl-2 pr-3 rounded-md hover:bg-gray-100 transition text-black active:scale-95">
            <img className="w-6 h-6 rounded-full" src="/eth2.png" alt="" />
            <span className="ml-1 text-sm">ETH</span>
          </button>
          <button className="flex items-center pl-2 pr-3 rounded-md hover:bg-gray-100 transition text-black active:scale-95">
            <img className="w-6 h-6 rounded-full" src="/eth2.png" alt="" />
            <span className="ml-1 text-sm">ETH</span>
          </button>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-4">{tokens}</div>
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

export function Swapper({ routes }: any) {
  const tokenSwapper = useTokenSwapper();
  const sellInputRef = useRef<any>(null);
  const [sellInput, setSellInput] = useState<any>(null);

  useEffect(() => {
    const numberInput = new NumberInput({
      el: sellInputRef.current as any,
      options: {
        locale: "en-US",
      },
      onInput(value) {
        tokenSwapper.setAmount(Number(value.number));
      },
    });

    numberInput.setValue(1);

    setSellInput(numberInput);

    return () => {
      numberInput.destroy();
    }
  }, []);

  const account = useAccount();
  const { openConnectModal } = useConnectModal();

  const wTENET = Tokens.find(
    (x) => x.address == "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
  );

  const getAmountOutContract = useContractRead({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "path",
            type: "address[]",
          },
        ],
        name: "getAmountsOut",
        outputs: [
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: "0x1D4BAFF7891f71F00B6F193F8adb88692ca2aEEf",
    functionName: "getAmountsOut",
    args: [
      tokenSwapper.tokenSwapper.amount * 10 ** 18,
      routes.length < 2
        ? [
            tokenSwapper.tokenSwapper.sellToken?.address,
            tokenSwapper.tokenSwapper.buyToken?.address,
          ]
        : [
            tokenSwapper.tokenSwapper.sellToken?.address,
            wTENET!.address,
            tokenSwapper.tokenSwapper.buyToken?.address,
          ],
    ],
    select: (data: any) => {
      console.log(Number(data[data.length - 1]) / 10 ** 18);
      return Number(data[data.length - 1]) / 10 ** 18;
    },
  });

  const approveContract = useContractWrite({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    address: tokenSwapper.tokenSwapper.sellToken?.address as any,
    functionName: "approve",
    value: BigInt(0),
  });

  const approveWaitForTransaction = useWaitForTransaction({
    hash: approveContract.data?.hash,
  });

  const handleApproveClick = async () => {
    const result = await approveContract.writeAsync({
      args: [
        "0x1D4BAFF7891f71F00B6F193F8adb88692ca2aEEf",
        tokenSwapper.tokenSwapper.amount * 10 ** 18,
      ],
    });
  };

  const swapContract = useContractWrite({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOutMin",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "path",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        name: "swapExactTokensForTokens",
        outputs: [
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "swapExactTokensForTokens",
    address: "0x1D4BAFF7891f71F00B6F193F8adb88692ca2aEEf",
    value: BigInt(0),
  });

  const swapWaitForTransaction = useWaitForTransaction({
    hash: swapContract.data?.hash,
  });

  const handleSwapClick = async (e: any) => {
    e.preventDefault();

    const result = await swapContract.writeAsync({
      args: [
        tokenSwapper.tokenSwapper.amount * 10 ** 18,
        0,
        routes.length < 2
          ? [
              tokenSwapper.tokenSwapper.sellToken?.address,
              tokenSwapper.tokenSwapper.buyToken?.address,
            ]
          : [
              tokenSwapper.tokenSwapper.sellToken?.address,
              wTENET!.address,
              tokenSwapper.tokenSwapper.buyToken?.address,
            ],
        account.address,
        Math.floor(Date.now() / 1000) + 60 * 20,
      ],
    });
  };

  const balanceOf = useBalanaceOfV2();

  useMemo(() => {
    if (swapWaitForTransaction.isSuccess) {
      setTimeout(() => {
        swapContract.reset();
        approveContract.reset();
      }, 2000);
    }
  }, [swapWaitForTransaction.isSuccess]);

  useMemo(() => {
    approveContract.reset();
    swapContract.reset();
  }, [tokenSwapper.tokenSwapper.buyToken, tokenSwapper.tokenSwapper.sellToken]);

  const [sellTokenBalance, setSellTokenBalance] = useState(0);

  useMemo(async () => {
    if (tokenSwapper.tokenSwapper.sellToken?.address) {
      const balance = await balanceOf.getBalance(
        tokenSwapper.tokenSwapper.sellToken?.address,
      );

      setSellTokenBalance(balance.formatted);
    }

    return () => {
      setSellTokenBalance(0);
    };
  }, [tokenSwapper.tokenSwapper.sellToken?.address]);

  const handleAllInClick = () => {
    sellInput.setValue(sellTokenBalance);
  };

  return (
    <div className="px-6 py-8 w-full xl:w-96 flex flex-col rounded-custom border border-border bg-secondary h-full">
      <ul className="flex text-xl w-full">
        <li className="text-primary grow border-b-2 border-primary pb-3 pb-cursor-pointer pr-4 font-medium">
          Swap
        </li>
        <li
          title="Coming Soon"
          className="cursor-not-allowed grow border-b border-[#D1D1D1] opacity-50 pr-4 font-medium"
        >
          Transfer
        </li>
        <li
          title="Coming Soon"
          className="cursor-not-allowed grow border-b border-[#D1D1D1] opacity-50 pr-4 font-medium"
        >
          Limit
        </li>
        <li
          title="Coming Soon"
          className="cursor-not-allowed grow border-b border-[#D1D1D1] opacity-50 pr-4 font-medium"
        >
          OTC
        </li>
      </ul>
      <div className="flex flex-col mt-6 gap-6 h-full">
        <div className="flex flex-col">
          <span className="text-xs font-medium mb-2">Out</span>
          <div className="flex flex-col relative w-full bg-white border border-borderg py-4 ring ring-transparent transition rounded-xl px-4 focus-within:ring-primary-light">
            <input
              ref={sellInputRef}
              required
              className=" text-lg outline-none"
              placeholder="0"
              type="text"
            />
            <SwapperChainButton type={SwapperChainButtonType.Sell} />
          
          </div>
            {account.isConnected && ( 
               <p
                onClick={handleAllInClick}
                title={NumberFormatter.format(sellTokenBalance)}
                className="text-sm text-[#777] ml-auto mt-4 truncate w-64"
              >
             Use Max  -  Balance: {NumberFormatter.format(sellTokenBalance)}
              </p>
            )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium mb-2">In</span>
          <div className="flex flex-col relative w-full">
            <input
              value={
                getAmountOutContract.isError
                  ? "Wrong input"
                  : getAmountOutContract.isLoading
                  ? "Loading..."
                  : NumberFormatter.format(
                      (getAmountOutContract.data as any) || 0,
                    )
              }
              disabled
              required
              className={`rounded-xl px-4 text-lg py-4 bg-white border border-border outline-none ring ring-transparent focus:ring-primary-light transition ${
                getAmountOutContract.isLoading ? "opacity-50" : ""
              }`}
              placeholder="0"
              type="text"
            />
            <SwapperChainButton centered type={SwapperChainButtonType.Buy} />
          </div>
        </div>

        <div className="flex flex-col mt-auto">
          {!account.isConnected && (
            <button
              onClick={openConnectModal}
              className="rounded-xl px-4 text-base py-4 mt-2 shadow bg-primary text-white font-medium hover:bg-primary-light active:scale-95 transition"
            >
              Connect Wallet
            </button>
          )}
          {account.isConnected && !approveWaitForTransaction.isSuccess && (
            <button
              onClick={handleApproveClick}
              disabled={
                approveWaitForTransaction.isLoading ||
                approveWaitForTransaction.isFetching
              }
              className="rounded-xl px-4 text-lg py-4 mt-2 shadow bg-primary text-white font-semibold hover:bg-primary-light active:scale-95 transition"
            >
              {approveWaitForTransaction.isLoading ||
              approveWaitForTransaction.isFetching
                ? "Approving..."
                : approveWaitForTransaction.isSuccess
                ? "Approved"
                : "Approve"}
            </button>
          )}
          {account.isConnected && approveWaitForTransaction.isSuccess && (
            <button
              onClick={handleSwapClick}
              className="rounded-xl px-4 text-lg py-4 mt-2 shadow bg-primary text-white font-semibold hover:bg-primary-light active:scale-95 transition"
            >
              {swapWaitForTransaction.isLoading ||
              swapWaitForTransaction.isFetching
                ? "Swapping..."
                : swapWaitForTransaction.isSuccess
                ? "Swapped"
                : "Swap"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
