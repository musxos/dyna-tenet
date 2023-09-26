"use client";

import { LineChartComponent } from "@/components/chart/line-chart";
import { Swapper } from "@/components/swapper";
import { useFetchTX } from "@/hooks/useFetchTX";
import { usePools } from "@/hooks/usePools";
import useTokenSwapper from "@/hooks/useTokenSwapper";
import { useContext, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useGetAmountOut } from "@/hooks/useGetAmountOut";
import Tokens from "@/context/tokens";
import { usePairTransactions } from "@/hooks/usePairTransactions";
import { motion } from "framer-motion";

const NumberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  maximumSignificantDigits: 6,
});

export default function Home() {
  const { tokens } = useContext(Tokens);
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
    const sellToken = tokenSwapper.tokenSwapper.sellToken;
    const buyToken = tokenSwapper.tokenSwapper.buyToken;

    if (pools.state.pools.length > 0) {
      if (sellToken?.symbol == "wETH" || buyToken?.symbol == "wETH") {
        if (sellToken?.isError || buyToken?.isError) {
          return;
        }
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
    const wTENET = tokens.find(
      (x) => x.address == "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
    );

    const sellToken = tokenSwapper.tokenSwapper.sellToken;
    const buyToken = tokenSwapper.tokenSwapper.buyToken;

    if (buyToken?.pairs.some((x) => x == sellToken?.address)) {
      setRoute([[sellToken!, buyToken!]]);
    } else if (buyToken?.pairs.some((x) => x == wTENET?.address)) {
      setRoute([
        [sellToken!, wTENET!],
        [wTENET!, buyToken!],
      ]);
    } else {
      setRoute([]);
    }
  }, [tokenSwapper.tokenSwapper.buyToken, tokenSwapper.tokenSwapper.sellToken]);

  const balanceOut = useGetAmountOut({
    amount: tokenSwapper.tokenSwapper.amount,
    path: routes as any,
  });

  const tx = useFetchTX({
    autoFetch: true,
  });

  const [chartDateRange, setChartDateRange] = useState<any>("24H");

  const pairTransactions = usePairTransactions(
    tokenSwapper.tokenSwapper.sellToken?.symbol || "",
    tokenSwapper.tokenSwapper.buyToken?.symbol || "",
    chartDateRange,
  );

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-3">
        <div className="flex lg:flex-row flex-col gap-3 min-h-[34rem] h-max shrink-0 grow">
          <Swapper routes={routes} />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="grow shrink w-full min-h-[34rem]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary border border-border h-full flex flex-col rounded-custom p-6 w-full"
            >
              <div className="flex lg:flex-row flex-col justify-between items-end">
                <div className="flex flex-nowrap flex-col mb-2 mr-auto">
                  <span className="text-sm text-[#777] font-medium">
                    {tokenSwapper.tokenSwapper.buyToken?.symbol} /{" "}
                    {tokenSwapper.tokenSwapper.sellToken?.symbol}
                  </span>
                  <span className="text-[40px] font-semibold">
                    {tokenSwapper.tokenSwapper.sellToken?.isError ||
                    tokenSwapper.tokenSwapper.buyToken?.isError
                      ? "-"
                      : NumberFormat.format(price || 0)}
                    <span className="text-xs ml-2 font-normal text-red-500">
                      -4.41% (Past 3 days)
                    </span>
                  </span>
                </div>

                <div className="flex ml-auto gap-4 mt-4">
                  <button
                    onClick={() => setChartDateRange("24H")}
                    className={
                      "rounded-custom border hover:border-primary hover:text-primary text-sm px-4 py-2 bg-transparent font-normal active:scale-95 transition w-max [&.active]:border-primary [&.active]:text-primary border-transparent " +
                      (chartDateRange == "24H" ? "active" : "")
                    }
                  >
                    24H
                  </button>
                  <button
                    onClick={() => setChartDateRange("1H")}
                    className={
                      "rounded-custom border border-transparent hover:border-primary hover:text-primary lg:block hidden text-sm px-4 py-2  font-normal active:scale-95 transition [&.active]:border-primary [&.active]:text-primary " +
                      (chartDateRange == "1H" ? "active" : "")
                    }
                  >
                    1H
                  </button>
                </div>
              </div>

              <div className="w-full mt-12">
                <LineChartComponent data={pairTransactions.pairTransactions}>
                  {" "}
                </LineChartComponent>
              </div>
            </motion.div>
          </div>

          {tokenSwapper.tokenSwapper.actionType == "order" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-secondary border border-border h-full flex flex-col rounded-custom p-6 w-full"
            >
              <h2 className="font-medium text-xl mb-1">Orders</h2>
              <p className="text-[#777] text-sm font-medium mb-4">
                You can place an order to buy or sell{" "}
                {tokenSwapper.tokenSwapper.sellToken?.symbol} /{" "}
                {tokenSwapper.tokenSwapper.buyToken?.symbol} at a specific
                price.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col">
                  <h3 className="font-medium mb-4  text-[#777] border-b pb-2">
                    Sell {tokenSwapper.tokenSwapper.sellToken?.symbol} Orders
                  </h3>

                  <div className="grid grid-cols-3 gap-1 px-1 pt-0.5 pb-2 font-medium text-[#777]">
                    <div className="col-span-1 text-xs">
                      Price ({tokenSwapper.tokenSwapper.buyToken?.symbol})
                    </div>
                    <div className="col-span-1 text-xs text-right">
                      Amount ({tokenSwapper.tokenSwapper.sellToken?.symbol})
                    </div>
                    <div className="col-span-1 text-xs text-right">
                      Total ({tokenSwapper.tokenSwapper.buyToken?.symbol})
                    </div>
                  </div>

                  {new Array(10).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="col-span-full grid grid-cols-3 px-1 py-0.5 hover:bg-[#F3F4F6] cursor-pointer border-b last:border-b-0"
                    >
                      <div className="col-span-1 text-sm text-red-500 font-medium">
                        55.56
                      </div>
                      <div className="col-span-1 text-sm text-right">61.1</div>
                      <div className="col-span-1 text-sm text-right">
                        3,394.72
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-medium mb-4  text-[#777] border-b pb-2">
                    Buy {tokenSwapper.tokenSwapper.buyToken?.symbol} Orders
                  </h3>

                  <div className="grid grid-cols-3 gap-1 px-1 pt-0.5 pb-2 font-medium text-[#777]">
                    <div className="col-span-1 text-xs">
                      Price ({tokenSwapper.tokenSwapper.buyToken?.symbol})
                    </div>
                    <div className="col-span-1 text-xs text-right">
                      Amount ({tokenSwapper.tokenSwapper.sellToken?.symbol})
                    </div>
                    <div className="col-span-1 text-xs text-right">
                      Total ({tokenSwapper.tokenSwapper.buyToken?.symbol})
                    </div>
                  </div>

                  {new Array(10).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="col-span-full grid grid-cols-3 px-1 py-0.5 hover:bg-[#F3F4F6] cursor-pointer border-b last:border-b-0"
                    >
                      <div className="col-span-1 text-sm text-green-500 font-medium">
                        55.56
                      </div>
                      <div className="col-span-1 text-sm text-right">61.1</div>
                      <div className="col-span-1 text-sm text-right">
                        3,394.72
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {clientWidth > 1024 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-custom border border-border bg-secondary overflow-x-auto px-6 py-8 grow hidden"
            >
              <h1 className="font-medium text-xl mb-6">Last transactions</h1>

              <table className="table-fixed min-w-[1024px] w-full">
                <thead>
                  <tr className="text-left text-[#777]">
                    <th className=" text-xs font-semibold py-4 pr-4">Pair</th>
                    <th className=" text-xs font-semibold py-4 pr-4">Price</th>

                    <th className=" text-xs font-semibold py-4 pr-4">Total</th>

                    <th className=" text-xs font-semibold py-4 pr-4">Amount</th>

                    <th className=" text-xs font-semibold py-4 pr-4">Time</th>

                    <th className=" text-xs font-semibold py-4 pr-4">Maker</th>
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
                          {NumberFormat.format(x.result.Price)} {x.result.Asset}
                        </td>
                        <td className="font-semibold py-3 pr-4 ">
                          {NumberFormat.format(x.result.Amount)}
                        </td>

                        <td className="font-semibold py-3 pr-4 ">
                          {NumberFormat.format(x.result.Amount)}{" "}
                          {x.result.Asset}
                        </td>

                        <td className="font-semibold py-3 pr-4 ">
                          {moment(new Date(x.date)).fromNow()}{" "}
                        </td>

                        <td className="font-semibold py-3 pr-4">
                          <a
                            target="_blank"
                            href={
                              "https://testnet.tenetscan.io/address/" + x.maker
                            }
                            className="text-blue-500 underline"
                          >
                            {x.maker.slice(0, 4) +
                              "..." +
                              x.maker.slice(x.maker.length - 4, x.maker.length)}
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
            </motion.div>
          )}
          {clientWidth < 1024 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 hidden"
            >
              <h1 className="font-medium text-xl mb-6">Last transactions</h1>

              <div className="grid grid-cols-1 gap-3">
                {tx.tx.map((x, i) => (
                  <div
                    key={i}
                    className="bg-secondary border border-border rounded-custom px-4 py-5 flex flex-col gap-3 text-sm"
                  >
                    <div className="flex">
                      <span className="text-[#777] font-medium w-32">Pair</span>
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
                        {NumberFormat.format(x.result.Amount)} {x.result.Asset}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-[#777] font-medium w-32">
                        Update
                      </span>
                      <span className="ml-12 font-medium">
                        {moment(new Date(x.date)).fromNow()}
                      </span>
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
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
