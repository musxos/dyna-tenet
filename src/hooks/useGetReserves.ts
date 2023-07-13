import { useMemo, useState } from "react";
import { useContractRead } from "wagmi";

interface Reserves {
  reserve0: number;
  reserve1: number;
}

export function useGetReserves(pairAddress: string) {
  const [data, setData] = useState<Reserves>({
    reserve0: 0,
    reserve1: 0,
  });

  const contract = useContractRead({
    abi: [
      {
        constant: true,
        inputs: [],
        name: "getReserves",
        outputs: [
          {
            internalType: "uint112",
            name: "_reserve0",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "_reserve1",
            type: "uint112",
          },
          {
            internalType: "uint32",
            name: "_blockTimestampLast",
            type: "uint32",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],

    functionName: "getReserves",
    address: pairAddress as any,
    args: [],
  });

  useMemo(() => {
    const _data: any = contract.data;
    if (_data) {
      setData({
        reserve0: Number(_data[0]) / 1e18,
        reserve1: Number(_data[1]) / 1e18,
      });
    }
  }, [contract.data]);

  return {
    data,
    contract,
  };
}
