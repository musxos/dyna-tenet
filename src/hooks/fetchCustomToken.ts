import { erc20ABI } from "wagmi";
import { readContracts } from "wagmi/actions";

export async function fetchCustomToken(address: any) {
  const data = await readContracts({
    allowFailure: true,
    contracts: [
      {
        abi: erc20ABI,
        address: address,
        functionName: "symbol",
        chainId: 155,
      },
      {
        abi: erc20ABI,
        address: address,
        chainId: 155,
        functionName: "decimals",
      },
      {
        abi: erc20ABI,
        chainId: 155,
        address: address,
        functionName: "name",
      },
      {
        abi: erc20ABI,
        chainId: 155,
        address: address,
        functionName: "totalSupply",
      },
    ],
  });

  return data;
}
