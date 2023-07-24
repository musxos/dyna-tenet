import { Tokens } from "@/app/constant/tokens";
import { LineChartComponent } from "@/components/chart/line-chart";
import { Navbar } from "@/components/layout/navbar";
import { Swapper } from "@/components/swapper";
import { useFetchTX } from "@/hooks/useFetchTX";
import { usePair } from "@/hooks/usePair";
import { usePools } from "@/hooks/usePools";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import { useEffect, useMemo, useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";

const NumberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  maximumSignificantDigits: 6,
});

export default function Home() {
  const tokenSwapper = useTokenSwapper();
  const pools = usePools({
    autoFetch: true,
  });

  const [clientWidth, setClientWidth] = useState<number>(0);

  useEffect(() => {
    setClientWidth(window.innerWidth);

    window.addEventListener("resize", () => {
      setClientWidth(window.innerWidth);
    });
  }, []);

  const [price, setPrice] = useState<number>(0);

  useMemo(() => {
    const wTENET = Tokens.find(
      (x) => x.address == "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
    );

    const sellToken = tokenSwapper.tokenSwapper.sellToken;
    const buyToken = tokenSwapper.tokenSwapper.buyToken;

    if (pools.state.pools.length > 0) {
      if (sellToken?.symbol == "wETH" || buyToken?.symbol == "wETH") {
        const ethPool = pools.state.pools.find((x) => x.owner.symbol == "wETH");
        let pool;

        if (sellToken?.symbol != "wETH") {
          pool = pools.state.pools.find(
            (x) => x.target.address == sellToken?.address,
          );

          setPrice(pool!.target.price / ethPool!.owner.price);
        } else if (buyToken?.symbol != "wETH") {
          pool = pools.state.pools.find(
            (x) => x.target.address == buyToken?.address,
          );
          setPrice(ethPool!.owner.price / pool!.target.price);
        }

        return;
      }

      const pool_1 = pools.state.pools.find(
        (x) => x.target.address == sellToken?.address,
      );
      const pool_2 = pools.state.pools.find(
        (x) => x.target.address == buyToken?.address,
      );

      if (!pool_1 || !pool_2) {
        return;
      }

      console.log("price", pool_1?.target.price / pool_2?.target.price);

      setPrice(pool_1?.target.price / pool_2?.target.price);
    }
  }, [
    pools.state.pools,
    tokenSwapper.tokenSwapper.sellToken,
    tokenSwapper.tokenSwapper.buyToken,
  ]);

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

  const tx = useFetchTX({
    autoFetch: true,
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-12 xl:px-0 px-4 mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex lg:flex-row flex-col gap-3">
            <div className="flex flex-col grow shrink-0 h-full">
              <Swapper routes={routes} />
            </div>
            <div className="grow">
              <div className="bg-secondary border border-border h-full flex flex-col rounded-custom p-6">
                <div className="flex lg:flex-row flex-col justify-between items-end">
                  <div className="flex flex-nowrap flex-col mb-2 mr-auto">
                    <span className="text-sm text-[#777] font-medium">
                      {tokenSwapper.tokenSwapper.buyToken?.symbol} /{" "}
                      {tokenSwapper.tokenSwapper.sellToken?.symbol}
                    </span>
                    <span className="text-[40px] font-semibold">
                      {NumberFormat.format(price)}
                      <span className="text-xs ml-2 font-normal text-red-500">
                        -4.41% (Past 3 days)
                      </span>
                    </span>
                  </div>

                  <div className="flex ml-auto gap-4 mt-4">
                    <button className="rounded-custom border border-primary text-primary text-sm px-4 py-2 bg-transparent font-normal active:scale-95 transition w-max">
                      All Time
                    </button>
                    <button className="rounded-custom border border-transparent lg:block hidden text-sm px-4 py-2  font-normal active:scale-95 transition">
                      7D
                    </button>
                    <button className="rounded text-sm px-4 py-2 font-normal lg:block hidden active:scale-95 transition">
                      1M
                    </button>
                  </div>
                </div>

                <div className="w-full mt-12">
                  <LineChartComponent></LineChartComponent>
                </div>
              </div>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-3">
            <div className="rounded-custom bg-secondary border border-border px-6 py-8 w-full xl:w-96 grow shrink-0 h-max">
              <div className="text-center font-medium text-xl">Trade Route</div>
              <div className="mt-12 flex flex-col gap-4">
                {routes?.map((route, i) => {
                  const sellToken = route[0];
                  const buyToken = route[1];

                  return (
                    <div key={i} className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full bg-secondary"
                        src={sellToken.image}
                        alt=""
                      />
                      <div className="grow border-b-4 border-border border-dotted relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                          {tokenSwapper.tokenSwapper.amount} {sellToken.symbol}
                        </div>
                      </div>
                      <img
                        className="w-8 h-8 rounded-full bg-secondary"
                        src={buyToken.image}
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {clientWidth > 1024 && (
              <div className="rounded-custom border border-border bg-secondary overflow-x-auto px-6 py-8">
                <h1 className="font-medium text-xl mb-6">Last transactions</h1>

                <table className="table-fixed min-w-[1024px] w-full">
                  <thead>
                    <tr className="text-left text-[#777]">
                      <th className=" text-xs font-semibold py-4 pr-4">Pair</th>
                      <th className=" text-xs font-semibold py-4 pr-4">
                        Price
                      </th>

                      <th className=" text-xs font-semibold py-4 pr-4">
                        Total
                      </th>

                      <th className=" text-xs font-semibold py-4 pr-4">
                        Amount
                      </th>

                      <th className=" text-xs font-semibold py-4 pr-4">
                        Time
                      </th>

                      <th className=" text-xs font-semibold py-4 pr-4">
                        Maker
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!tx.isLoading &&
                      tx.tx.map((x, i) => (
                        <tr key={i}>
                          <td className="font-semibold py-3 pr-4 ">
                            <div className="flex items-center gap-2">
                              {x.pair}
                            </div>
                          </td>
                          <td className="font-semibold py-3 pr-4 ">
                            {NumberFormat.format(x.result.Price)}{" "}
                            {x.result.Asset}
                          </td>
                          <td className="font-semibold py-3 pr-4 ">
                            {NumberFormat.format(x.result.Amount)}
                          </td>

                          <td className="font-semibold py-3 pr-4 ">
                            {NumberFormat.format(x.result.Amount)}{" "}
                            {x.result.Asset}
                          </td>

                          <td className="font-semibold py-3 pr-4 ">
                            {x.date} minute ago
                          </td>

                          <td className="font-semibold py-3 pr-4">
                            <a
                              target="_blank"
                              href={
                                "https://testnet.tenetscan.io/address/" +
                                x.maker
                              }
                              className="text-blue-500 underline"
                            >
                              {x.maker.slice(0, 4) +
                                "..." +
                                x.maker.slice(
                                  x.maker.length - 4,
                                  x.maker.length,
                                )}
                            </a>
                          </td>
                        </tr>
                      ))}
                    {tx.isLoading &&
                      new Array(10).fill(0).map((x, j) => (
                        <tr key={j}>
                          <td className="font-semibold py-3 pr-4 ">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </td>
                          <td className="font-semibold py-3 pr-4 ">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </td>
                          <td className="font-semibold py-3 pr-4 ">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </td>

                          <td className="font-semibold py-3 pr-4 ">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </td>

                          <td className="font-semibold py-3 pr-4 ">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </td>

                          <td className="font-semibold py-3 pr-4">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {clientWidth < 1024 && (
              <div className="mt-8">
                <h1 className="font-medium text-xl mb-6">Last transactions</h1>

                <div className="grid grid-cols-1 gap-3">
                  {tx.tx.map((x, i) => (
                    <div
                      key={i}
                      className="bg-secondary border border-border rounded-custom px-4 py-5 flex flex-col gap-3 text-sm"
                    >
                      <div className="flex">
                        <span className="text-[#777] font-medium w-32">
                          Pair
                        </span>
                        <span className="ml-12 font-medium"> {x.pair}</span>
                      </div>
                      <div className="flex">
                        <span className="text-[#777] font-medium w-32">
                          Price
                        </span>
                        <span className="ml-12 font-medium">
                          {" "}
                          {NumberFormat.format(x.result.Price)} {x.result.Asset}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-[#777] font-medium w-32">
                          Total
                        </span>
                        <span className="ml-12 font-medium">
                          {" "}
                          {NumberFormat.format(x.result.Amount)}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-[#777] font-medium w-32">
                          Amount
                        </span>
                        <span className="ml-12 font-medium">
                          {NumberFormat.format(x.result.Amount)}{" "}
                          {x.result.Asset}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-[#777] font-medium w-32">
                          Update
                        </span>
                        <span className="ml-12 font-medium">1 minute ago</span>
                      </div>
                      <div className="flex">
                        <span className="text-[#777] font-medium w-32">
                          Maker
                        </span>
                        <span className="ml-12 font-medium">
                          {" "}
                          <a
                            target="_blank"
                            href={
                              "https://testnet.tenetscan.io/address/" + x.maker
                            }
                            className="text-primary underline"
                          >
                            {x.maker.slice(0, 6) +
                              "..." +
                              x.maker.slice(x.maker.length - 4, x.maker.length)}
                          </a>
                        </span>
                      </div>
                    </div>
                  ))}
                  {tx.isLoading &&
                    new Array(10).fill(0).map((x, j) => (
                      <div
                        key={j}
                        className="bg-secondary border border-border rounded-custom px-4 py-5 flex flex-col gap-3 text-sm"
                      >
                        <div className="flex">
                          <span className="text-[#777] font-medium w-32">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                          <span className="ml-12 font-medium">
                            {" "}
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-[#777] font-medium w-32">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                          <span className="ml-12 font-medium">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-[#777] font-medium w-32">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                          <span className="ml-12 font-medium">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-[#777] font-medium w-32">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                          <span className="ml-12 font-medium">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-[#777] font-medium w-32">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                          <span className="ml-12 font-medium">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-[#777] font-medium w-32">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                          <span className="ml-12 font-medium">
                            <div className="w-24 h-2 rounded-full animate-pulse bg-[#777]" />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
