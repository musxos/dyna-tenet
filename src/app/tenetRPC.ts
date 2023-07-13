export const tenetRPC = {
  id: 155,
  name: "TENET",
  network: "TENET",
  iconUrl: "/wtenet.png",
  nativeCurrency: {
    decimals: 18,
    name: "TENET",
    symbol: "TENET",
  },
  rpcUrls: {
    public: { http: ["https://rpc.testnet.tenet.org/"] },
    default: { http: ["https://rpc.testnet.tenet.org/"] },
  },
  blockExplorers: {
    etherscan: { name: "tenetscan", url: "https://testnet.tenetscan.io/" },
    default: { name: "tenetscan", url: "https://testnet.tenetscan.io/" },
  },
};
