import { useContractRead } from "wagmi";

export function useTotalSupply(address: string) {
  const contract = useContractRead({
    abi: [
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "totalSupply",
    address: address as any,
    args: [],
    select(data) {
      return Number(data) / 1e18;
    },
  });

  return {
    data: contract.data,
    contract,
  };
}
