import config from "@/app/config";
import { useContractWrite, useWaitForTransaction } from "wagmi";

export function useAddLiquidity() {
  const contract = useContractWrite({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "tokenA",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountADesired",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountBDesired",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountAMin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountBMin",
            type: "uint256",
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
        name: "addLiquidity",
        outputs: [
          {
            internalType: "uint256",
            name: "amountA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountB",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidity",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],

    functionName: "addLiquidity",
    value: BigInt(0),
    address: config.ROUTER_ADDRESS as any,
  });

  const waitForTransaction = useWaitForTransaction({
    hash: contract.data?.hash,
  });

  return {
    contract,
    waitForTransaction,
  };
}
