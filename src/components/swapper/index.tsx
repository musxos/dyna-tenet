import { useCallback, useEffect, useMemo, useState } from "react";
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

const NumberFormatter = new Intl.NumberFormat("en-US");

export enum SwapperChainButtonType {
  Sell,
  Buy,
}

export type SwapperChainButtonProps = {
  type: SwapperChainButtonType;
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

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 mx-5 px-2 py-2 rounded-2xl text-left"
    >
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
        className="w-[32rem] bg-white shadow rounded-2xl py-5"
        open={open}
        setOpen={setOpen}
      >
        <h1 className="px-5 text-lg text-black font-medium">Select a token</h1>
        <div className="mt-3 px-5">
          <div className="flex items-center px-4 py-3 gap-3 bg-gray-200 rounded-2xl w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              className="bg-transparent outline-none"
              placeholder="Search name or paste address"
              type="text"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4 px-5">
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
        className="flex items-center gap-2 right-3 top-1/2 -translate-y-1/2 absolute bg-white rounded-md px-2 py-1 active:scale-95 transition"
      >
        <img
          className="w-8 h-8 rounded-full bg-neutral-800"
          src={
            (props.type == SwapperChainButtonType.Buy
              ? tokenSwapper.tokenSwapper.buyToken
              : tokenSwapper.tokenSwapper.sellToken
            )?.image
          }
          alt=""
        />

        <span className="text-black font-inter font-medium">
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
          className="w-4 h-4 stroke-black"
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
      console.log(data);
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
        Math.floor(Date.now() / 1000) + 60 * 1000,
      ],
    });
  };

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

  return (
    <div className="p-6 w-full md:w-96 rounded-xl border border-neutral-700 bg-neutral-800 h-max grow shrink-0">
      <ul className="flex gap-4">
        <li className="text-white font-semibold cursor-pointer">Swap</li>
        <li className="text-white/50 hover:text-white hover:font-semibold cursor-pointer">
          Transfer
        </li>
        <li className="text-white/50 hover:text-white hover:font-semibold cursor-pointer">
          Limit
        </li>
        <li className="text-white/50 hover:text-white hover:font-semibold cursor-pointer">
          OTC
        </li>
      </ul>
      <div className="flex flex-col mt-6 gap-6">
        <div className="flex flex-col">
          <span className="text-xs font-medium mb-2">Ödeme</span>
          <div className="flex flex-col relative w-full">
            <input
              value={tokenSwapper.tokenSwapper.amount}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) {
                  return;
                }

                tokenSwapper.setAmount(Number(e.target.value));
              }}
              required
              className="rounded-xl px-4 text-lg py-4 shadow bg-neutral-900 outline-none ring ring-transparent focus:ring-primary-light transition"
              placeholder="0"
              type="number"
            />
            <SwapperChainButton type={SwapperChainButtonType.Sell} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium mb-2">Çekme</span>
          <div className="flex flex-col relative w-full">
            <input
              value={NumberFormatter.format(getAmountOutContract.data || 0)}
              disabled
              required
              className="rounded-xl px-4 text-lg py-4 shadow bg-neutral-900 outline-none ring ring-transparent focus:ring-primary-light transition"
              placeholder="0"
              type="text"
            />
            <SwapperChainButton type={SwapperChainButtonType.Buy} />
          </div>
        </div>
        <div className="flex flex-col">
          {!account.isConnected && (
            <button
              onClick={openConnectModal}
              className="rounded-xl px-4 text-lg py-4 mt-2 shadow bg-primary text-white font-semibold hover:bg-primary-light active:scale-95 transition"
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
        <div className="flex px-4 py-3 border rounded border-neutral-700 bg-neutral-700/20">
          1 DYNA = 0.00000000 USD
        </div>
      </div>
    </div>
  );
}
