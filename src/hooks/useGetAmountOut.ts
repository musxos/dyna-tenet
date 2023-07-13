import { useContractRead } from "wagmi";

export function useGetAmountOut({
  amount = 0,
  path = [],
}: {
  amount: number;
  path: string[];
}) {
  const contract = useContractRead({
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
    args: [amount * 1e18, path],
    enabled: path.length > 0 && amount > 0,
    select: (data: any) => {
      return Number(data[data.length - 1]) / 10 ** 18;
    },
  });

  return {
    data: contract.data,
    contract,
  };
}
