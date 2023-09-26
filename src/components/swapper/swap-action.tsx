import { InitTokens } from "@/context/tokens";
import { useAllowance } from "@/hooks/useAllowance";
import { useBalanaceOfV2 } from "@/hooks/useBalanceOf.v2";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { NumberInput } from "intl-number-input";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useFeeData,
  useWaitForTransaction,
} from "wagmi";
import { SwapperChainButtonType } from ".";
import { motion } from "framer-motion";
import { SwapperChainButton } from "./swap-chain-button";

const NumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 12,
  maximumSignificantDigits: 12,
});

const variants = {
  flip3D: {
    rotateY: 180,
    transition: {
      duration: 0.5,
    },
  },
};

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
