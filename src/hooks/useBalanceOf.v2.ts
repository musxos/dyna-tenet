import { useAccount } from "wagmi";
import { readContract, fetchBalance } from "wagmi/actions";

export function useBalanaceOfV2() {
  const account = useAccount();

  async function getBalance(tokenAddress: string) {
    if (!account.address) {
      return {
        raw: 0,
        formatted: 0,
      };
    }

    const data = await readContract({
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
      address: tokenAddress as any,
      functionName: "balanceOf",
      args: [account.address],
    });

    const number = Number(data);

    return {
      raw: number,
      formatted: number / 10 ** 18,
    };
  }

  return { getBalance };
}
