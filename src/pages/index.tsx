import { LineChartComponent } from "@/components/chart/line-chart";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-12 md:px-0 px-4 mb-8">
        <div className="flex md:flex-row flex-col gap-12">
          <div className="p-6 w-full md:w-96 rounded-xl border border-neutral-700 bg-neutral-800 h-max">
            <ul className="flex gap-4">
              <li className="text-white font-semibold cursor-pointer">Swap</li>
              <li className="text-white/50 hover:text-white hover:font-semibold cursor-pointer">
                Transfer
              </li>
              <li className="text-white/50 hover:text-white hover:font-semibold cursor-pointer">
                Limit
              </li>
              <li className="text-white/50 hover:text-white hover:font-semibold cursor-pointer">
                OTC
              </li>
            </ul>
            <div className="flex flex-col mt-6 gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-medium">Ödeme</span>
                <input
                  required
                  className="rounded-xl px-4 text-lg py-4 mt-2 shadow bg-neutral-900 outline-none ring ring-transparent focus:ring-primary-light transition"
                  placeholder="0"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">Çekme</span>
                <input
                  className="rounded-xl px-4 text-lg py-4 mt-2 shadow bg-neutral-900 outline-none ring ring-transparent focus:ring-primary-light transition"
                  placeholder="0"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <button className="rounded-xl px-4 text-lg py-4 mt-2 shadow bg-primary text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                  Connect Wallet
                </button>
              </div>
              <div className="flex px-4 py-3 border rounded border-neutral-700 bg-neutral-700/20">
                1 DYNA = 0.00000000 USD
              </div>
            </div>
          </div>
          <div className="grow">
            <div className="flex flex-col w-full">
              <div className="flex flex-col mb-2">
                <span className="text-white/80 text-xs font-semibold">
                  USDT / DYNA
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
                <div className="text-center text-white/80">
                  Estimated Gas Price
                </div>
                <div className="mt-12 flex flex-col gap-4">
                  <div className="flex items-center">
                    <img
                      className="w-11 h-11 p-2 rounded-full bg-neutral-800"
                      src="/eth.png"
                      alt=""
                    />
                    <div className="grow border-b-4 border-neutral-700 border-dotted relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
                        3.5 ETH
                      </div>
                    </div>
                    <img
                      className="w-11 h-11 p-2 rounded-full bg-neutral-800"
                      src="/eth.png"
                      alt=""
                    />
                  </div>
                  <div className="flex items-center">
                    <img
                      className="w-11 h-11 p-2 rounded-full bg-neutral-800"
                      src="/eth.png"
                      alt=""
                    />
                    <div className="grow border-b-4 border-neutral-700 border-dotted relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
                        3.18 ETH
                      </div>
                    </div>
                    <img
                      className="w-11 h-11 p-2 rounded-full bg-neutral-800"
                      src="/eth.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded border border-neutral-800 overflow-x-auto">
                <table className="table-fixed min-w-[1024px] w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Exchange
                      </th>
                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Price
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Spread
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Change
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Update
                      </th>

                      <th className="text-white/80 text-xs font-semibold py-4 px-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        <div className="flex items-center gap-2">
                          Binance
                          <div className="text-xs bg-green-300 w-max px-1 py-0.5 rounded text-black ">
                            Best Price
                          </div>
                        </div>
                      </td>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        1869.34
                      </td>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        0.01%
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        -4.41%
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        1 minute ago
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4">
                        <button className="rounded-xl px-4  py-1 mt-2 shadow bg-primary text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                          Buy
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        <div className="flex items-center gap-2">Coinbase</div>
                      </td>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        1869.34
                      </td>
                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        0.01%
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        -4.41%
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4 ">
                        1 minute ago
                      </td>

                      <td className="text-white text-sm font-semibold py-2 px-4">
                        <button className="rounded-xl px-4  py-1 mt-2 shadow bg-primary text-white font-semibold hover:bg-primary-light active:scale-95 transition">
                          Buy
                        </button>
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
