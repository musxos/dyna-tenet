import { Tokens } from "@/app/constant/tokens";
import { LineChartComponent } from "@/components/chart/line-chart";
import { Navbar } from "@/components/layout/navbar";
import { Swapper } from "@/components/swapper";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import { useMemo, useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";

export default function Home() {
  const tokenSwapper = useTokenSwapper();

  const [routes, setRoute] = useState<any[]>();

  useMemo(() => {
    const wTENET = Tokens.find(
      (x) => x.address == "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
    );

    const sellToken = tokenSwapper.tokenSwapper.sellToken;
    const buyToken = tokenSwapper.tokenSwapper.buyToken;

    if (buyToken?.pairs.some((x) => x == sellToken?.address)) {
      setRoute([[sellToken!, buyToken!]]);
    } else {
      setRoute([
        [sellToken!, wTENET!],
        [wTENET!, buyToken!],
      ]);
    }
  }, [tokenSwapper.tokenSwapper.buyToken, tokenSwapper.tokenSwapper.sellToken]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-12 xl:px-0 px-4 mb-8">
        <div className="flex xl:flex-row flex-col gap-12">
          <Swapper routes={routes} />
          <div className="grow">
            <div className="flex flex-col w-full">
              <div className="flex flex-col mb-2">
                <span className="text-white/80 text-xs font-semibold">
                  {tokenSwapper.tokenSwapper.buyToken?.symbol} /{" "}
                  {tokenSwapper.tokenSwapper.sellToken?.symbol}
                </span>
                <span className="text-white text-2xl font-semibold">
                  1869.34
                  <span className="text-xs ml-2 text-red-500">
                    -4.41% (Past 3 days)
                  </span>
                </span>
              </div>
              <div className="w-full">
                <LineChartComponent></LineChartComponent>
              </div>
              <div className="flex ml-auto gap-4 mt-4 mr-6">
                <button className="rounded text-sm px-4 py-2 shadow bg-transparent text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                  12H
                </button>
                <button className="rounded text-sm px-4 py-2 shadow bg-transparent text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                  1D
                </button>
                <button className="rounded text-sm px-4 py-2 shadow bg-transparent text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                  3D
                </button>
                <button className="rounded text-sm px-4 py-2 shadow bg-transparent text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                  1W
                </button>
                <button className="rounded text-sm px-4 py-2 shadow bg-transparent text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                  1M
                </button>
              </div>
              <div className="mt-8 rounded border border-neutral-800 px-12 py-4">
                <div className="text-center text-white/80">Trade Route</div>
                <div className="mt-12 flex flex-col gap-4">
                  {routes?.map((route, i) => {
                    const sellToken = route[0];
                    const buyToken = route[1];

                    return (
                      <div key={i} className="flex items-center">
                        <img
                          className="w-11 h-11 rounded-full bg-neutral-800"
                          src={sellToken.image}
                          alt=""
                        />
                        <div className="grow border-b-4 border-neutral-700 border-dotted relative">
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
                            {tokenSwapper.tokenSwapper.amount}{" "}
                            {sellToken.symbol}
                          </div>
                        </div>
                        <img
                          className="w-11 h-11 rounded-full bg-neutral-800"
                          src={buyToken.image}
                          alt=""
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8 rounded border border-neutral-800 overflow-x-auto">
                <table className="table-fixed min-w-[1024px] w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Type
                      </th>
                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Price ({tokenSwapper.tokenSwapper.sellToken?.symbol})
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Total
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Amount ({tokenSwapper.tokenSwapper.buyToken?.symbol})
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Update
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Maker
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-300 w-max px-2 py-0.5 rounded text-black ">
                            Buy
                          </div>
                        </div>
                      </td>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        1869.34
                      </td>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        3.000
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        4.5
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        1 minute ago
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4">
                        <a
                          href="google.com"
                          className="text-blue-500 underline"
                        >
                          0x4b08...d2db
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
