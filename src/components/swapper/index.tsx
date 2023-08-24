import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Modal from "../modal";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import { Token } from "@/features/token-swapper/token-swapper.slice";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useFeeData,
  useWaitForTransaction,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";

import { NumberInput } from "intl-number-input";
import { useBalanaceOfV2 } from "@/hooks/useBalanceOf.v2";
import { isAddress } from "viem";
import { fetchCustomToken } from "@/hooks/fetchCustomToken";
import Tokens, { InitTokens } from "@/context/tokens";
import { getAllPairs } from "@/hooks/getAllPairs";
import { useAllowance } from "@/hooks/useAllowance";
import { AnimatePresence, motion } from "framer-motion";

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

const variants = {
  flip3D: {
    rotateY: 180,
    transition: {
      duration: 0.5,
    },
  },
};

export function Swapper({ routes }: any) {
  const { tokenSwapper, setActionType } = useTokenSwapper();

  const activeClass = classNames("text-primary border-b-2 border-primary");
  const defaultClass = classNames("border-b border-[#D1D1D1] opacity-50");

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8 w-full xl:w-[32rem] flex flex-col rounded-custom border border-border bg-secondary h-full"
    >
      <ul className="flex text-xl w-full">
        <li
          onClick={() => setActionType("swap")}
          className={
            "grow pb-3 cursor-pointer pr-4 font-medium " +
            (tokenSwapper.actionType == "swap" ? activeClass : defaultClass)
          }
        >
          Swap
        </li>
        <li
          onClick={() => setActionType("order")}
          title="Coming Soon"
          className={
            "grow pr-4 font-medium cursor-pointer " +
            (tokenSwapper.actionType == "order" ? activeClass : defaultClass)
          }
        >
          Order
        </li>
      </ul>
      <div className="flex flex-col mt-6 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={tokenSwapper.actionType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {tokenSwapper.actionType == "swap" && (
              <SwapAction routes={routes} />
            )}
            {tokenSwapper.actionType == "order" && <OrderAction />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function OrderAction() {
  const account = useAccount();
  return (
    <>
      <div className="flex flex-col mb-4">
        <label
          htmlFor="in"
          className="flex flex-col relative w-full bg-gray-100 border border-border py-4 ring ring-transparent transition rounded-xl px-4 focus-within:ring-primary-light "
        >
          <span className="text-[#777] text-sm font-medium mb-2">
            You sell at most
          </span>
          <input
            id="in"
            required
            className=" text-xl font-semibold text-primary-dark outline-none bg-transparent"
            placeholder="0.0"
            type="text"
          />
          <SwapperChainButton type={SwapperChainButtonType.Sell} />
          {account.isConnected && (
            <p className="text-sm text-right ml-auto text-[#777] mt-4 truncate w-32">
              Balance: 0
            </p>
          )}
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label
          htmlFor="limitPrice"
          className="col-span-2 rounded-xl bg-gray-100 border border-border px-4 py-2 ring ring-transparent focus-within:ring-primary"
        >
          <span className="text-[#777] text-sm font-medium">Limit price</span>
          <input
            id="limitPrice"
            className="bg-transparent outline-none text-lg mt-2 font-medium"
            type="text"
          />
        </label>
        <label
          htmlFor="expiry"
          className="col-span-1 rounded-xl bg-gray-100 border border-border px-4 py-2 ring ring-transparent focus-within:ring-primary"
        >
          <span className="text-[#777] text-sm font-medium">Expiry</span>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium">7 Days</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </label>
      </div>

      <hr className="my-8" />
      <div className="flex flex-col mb-4">
        <label
          htmlFor="out"
          className="flex flex-col relative w-full bg-gray-100 border border-border py-4 ring ring-transparent transition rounded-xl px-4 focus-within:ring-primary-light "
        >
          <span className="text-[#777] text-sm font-medium mb-2">
            You receive exactly
          </span>
          <input
            id="out"
            required
            className="font-semibold text-primary-dark outline-none bg-transparent text-xl"
            placeholder="0.0"
            type="text"
          />
          <SwapperChainButton type={SwapperChainButtonType.Buy} />
        </label>
      </div>

      <div className="flex flex-col">
        {!account.isConnected && (
          <button className="rounded-xl px-4 text-base py-4 mt-2 shadow bg-primary text-white font-medium hover:bg-primary-light active:scale-95 transition">
            Connect Wallet
          </button>
        )}
      </div>
    </>
  );
}

export function SwapAction({ routes }: any) {
  const tokenSwapper = useTokenSwapper();
  const sellInputRef = useRef<any>(null);
  const [sellInput, setSellInput] = useState<any>(null);
  const feeData = useFeeData({
    watch: true,
  });

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

    numberInput.setValue(0);

    setSellInput(numberInput);

    return () => {
      numberInput.destroy();
    };
  }, []);

  const account = useAccount();
  const { openConnectModal } = useConnectModal();

  const wTENET = InitTokens?.find(
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

  const ownerTokenAllowance = useAllowance(
    tokenSwapper.tokenSwapper.sellToken?.address as any,
  );

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

  useEffect(() => {
    approveContract.reset();
    ownerTokenAllowance.contract.refetch();
  }, [approveWaitForTransaction.isSuccess, swapWaitForTransaction.isSuccess]);

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

      balanceOf
        .getBalance(tokenSwapper.tokenSwapper.sellToken?.address!)
        .then((balance) => {
          setSellTokenBalance(balance.formatted);
        });
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

  const changeTokens = () => {
    const old = {
      sellToken: tokenSwapper.tokenSwapper.sellToken,
      buyToken: tokenSwapper.tokenSwapper.buyToken,
    };
    tokenSwapper.setSellToken(old.buyToken!);
    tokenSwapper.setBuyToken(old.sellToken!);
  };

  const handleAllInClick = () => {
    sellInput.setValue(sellTokenBalance);
  };
  return (
    <>
      <div className="flex flex-col">
        <label
          htmlFor="in"
          className="flex flex-col relative w-full bg-gray-100 border border-borderg py-4 ring ring-transparent transition rounded-xl px-4 focus-within:ring-primary-light"
        >
          <input
            ref={sellInputRef}
            id="in"
            required
            className=" text-lg outline-none bg-transparent"
            placeholder="0.0"
            type="text"
          />
          <SwapperChainButton type={SwapperChainButtonType.Sell} />
          {account.isConnected && (
            <p
              onClick={handleAllInClick}
              title={NumberFormatter.format(sellTokenBalance)}
              className="text-sm text-right ml-auto text-[#777] mt-4 truncate w-32"
            >
              Balance: {NumberFormatter.format(sellTokenBalance)}
            </p>
          )}
        </label>
      </div>
      <div className="flex justify-center h-6">
        <motion.div
          variants={variants}
          animate="flip3D"
          onClick={changeTokens}
          className="flex items-center justify-center w-10 h-10 rounded-xl border-4 border-white bg-gray-200 -mt-2 z-50 -mb-2 my-2 hover:-mt-3 transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 stroke-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
        </motion.div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col relative w-full">
          <input
            value={
              getAmountOutContract.isError
                ? tokenSwapper.tokenSwapper.amount == 0
                  ? "0.0"
                  : getAmountOutContract.error?.name ==
                    "ContractFunctionExecutionError"
                  ? "No liquidity"
                  : getAmountOutContract.error?.message
                : getAmountOutContract.isLoading
                ? "Loading..."
                : NumberFormatter.format(
                    (getAmountOutContract.data as any) || 0,
                  )
            }
            disabled
            required
            className={`rounded-xl px-4 text-lg py-4 bg-gray-100 border border-border outline-none ring ring-transparent focus:ring-primary-light transition ${
              getAmountOutContract.isLoading ? "opacity-50" : ""
            }`}
            placeholder="0"
            type="text"
          />
          <SwapperChainButton centered type={SwapperChainButtonType.Buy} />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-6">
        <div className="text-xs text-[#777] flex justify-between">
          <span>Price</span>{" "}
          <span className="font-bold">
            1 {tokenSwapper.tokenSwapper.sellToken?.symbol} ={" "}
            {NumberFormatter.format(
              (getAmountOutContract.data as any) /
                tokenSwapper.tokenSwapper.amount || 0,
            )}{" "}
            {tokenSwapper.tokenSwapper.buyToken?.symbol}
          </span>
        </div>
        <div className="text-xs text-[#777] flex justify-between">
          <span>Gas price</span>{" "}
          <span className="font-bold">
            {feeData.isLoading
              ? "Loading..."
              : feeData.isSuccess
              ? feeData.data?.formatted.gasPrice
              : "Error"}
          </span>
        </div>
        <div className="text-xs text-[#777] flex justify-between">
          <span>Fee</span> <span className="font-bold">0</span>
        </div>
        <div className="text-xs text-[#777] flex justify-between">
          <span>Fees (incl. gas costs)</span>{" "}
          <span className="font-bold">
            {feeData.isLoading
              ? "Loading..."
              : feeData.isSuccess
              ? feeData.data?.formatted.gasPrice
              : "Error"}
          </span>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        {!account.isConnected && (
          <button
            onClick={openConnectModal}
            className="rounded-xl px-4 text-base py-4 mt-2 shadow bg-primary text-white font-medium hover:bg-primary-light active:scale-95 transition"
          >
            Connect Wallet
          </button>
        )}
        {account.isConnected &&
          (ownerTokenAllowance.data?.allowance || 0) <
            tokenSwapper.tokenSwapper.amount && (
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
        {account.isConnected &&
          (ownerTokenAllowance.data?.allowance || 0) >=
            tokenSwapper.tokenSwapper.amount && (
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
    </>
  );
}
