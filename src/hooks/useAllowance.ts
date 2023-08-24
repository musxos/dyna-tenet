import config from "@/app/config";
import { useAccount, useContractRead } from "wagmi";

export function useAllowance(tokenAddress: string) {
  const account = useAccount();

  const contract = useContractRead({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
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
    watch: true,

    address: tokenAddress as any,
    functionName: "allowance",

    enabled: !!account.isConnected && !!config.ROUTER_ADDRESS,

    args: [account.address, config.ROUTER_ADDRESS as any],

    select: (data) => {
      return {
        allowance: Number(data) / 1e18,
      };
    },
  });

  return {
    contract,
    data: contract.data,
  };
}
