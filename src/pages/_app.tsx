// @ts-nocheck

import { store } from "@/app/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import "@rainbow-me/rainbowkit/styles.css";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { tenetRPC } from "@/app/tenetRPC";

const { chains, publicClient } = configureChains(
  [tenetRPC, polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://rpc.testnet.tenet.org",
        ws: "wss://rpc.testnet.tenet.org/ws",
      }),
    }),
    alchemyProvider({ stallTimeout: 1000 }),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
