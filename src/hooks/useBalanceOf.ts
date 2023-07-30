import { useAccount, useContractRead } from "wagmi";

export function useBalanceOf(pairAddress: string) {
  const account = useAccount();

  const contract = useContractRead({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: pairAddress as any,
    functionName: "balanceOf",
    args: [account.address],
    enabled: !!account.address,
    select: (data) => {
      return Number(data) / 10 ** 18;
    },
  });

  return {
    data: contract.data,
    contract,
  };
}
