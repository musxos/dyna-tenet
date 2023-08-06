import { readContract } from "wagmi/actions";

import DYNA from "@/app/abi/DYNA.json";
import config from "@/app/config";

export async function getAllPairs(address: any) {
  try {
    const pairs = await readContract({
      abi: DYNA,
      functionName: "allPairs",
      args: [address],
      address: config.ROUTER_ADDRESS as any,
    });

    return {
      pairs,
      isError: false,
    };
  } catch (error) {
    return {
      pairs: [],
      isError: true,
    };
  }
}
