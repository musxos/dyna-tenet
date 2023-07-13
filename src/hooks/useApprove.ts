import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useApprove(address: string) {
  const contract = useContractWrite({
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
    functionName: "approve",
    value: BigInt(0),
    address: address as any,
  });

  const waitForTransaction = useWaitForTransaction({
    hash: contract.data?.hash,
  });

  return {
    contract,
    waitForTransaction,
  };
}
