export enum PoolType {
  Stable = "Stable",
}

export type Pool = {
  owner: {
    symbol: string;
    address: string;
    price: number;
    image: string;
  };
  target: {
    symbol: string;
    address: string;
    price: number;
    image: string;
  };
  pool: {
    pairAddress: string;
    liquidity: number;
    apr: number;
    type: PoolType;
    feeApr: number;
    rewardApr: number;
  };
};

export const Pools: Pool[] = [
  {
    owner: {
      symbol: "DYNA",
      address: "0xAA182427aE4F92b91d7210c609aCa6e6B54C8d8e",
      price: 1,
      image: "/dyna.jpg",
    },
    target: {
      address: "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
      price: 0.2,
      symbol: "wTENET",
      image: "/wtenet.png",
    },
    pool: {
      pairAddress: "0xa7d7987715C3011828ccb46E827dc3Aab62060F1",
      liquidity: 0,
      apr: 0,
      type: PoolType.Stable,
      feeApr: 0,
      rewardApr: 0,
    },
  },
  {
    owner: {
      symbol: "DUSD",
      address: "0xEf334F07FBFCa2c9d2b09938d66263811AD826Ec",
      price: 1,
      image: "/dusd.png",
    },
    target: {
      address: "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
      price: 0.2,
      symbol: "wTENET",
      image: "/wtenet.png",
    },
    pool: {
      pairAddress: "0xa7EAcE846c98Dee2A06e07B08AF80D772b2bF3e5",
      liquidity: 0,
      apr: 0,
      type: PoolType.Stable,
      feeApr: 0,
      rewardApr: 0,
    },
  },
  {
    owner: {
      symbol: "wBTC",
      address: "0xa2760015c760e6B33b970B4bae3E52b5DA2eAfF4",
      price: 1,
      image: "/btc.png",
    },
    target: {
      address: "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
      price: 0.2,
      symbol: "wTENET",
      image: "/wtenet.png",
    },
    pool: {
      pairAddress: "0xE6F0Ca507F31F3602a0518aE8088825f9cd89E81",
      liquidity: 0,
      apr: 0,
      type: PoolType.Stable,
      feeApr: 0,
      rewardApr: 0,
    },
  },
  {
    owner: {
      symbol: "wETH",
      address: "0xa2760015c760e6B33b970B4bae3E52b5DA2eAfF4",
      price: 1,
      image: "/eth2.png",
    },
    target: {
      address: "0x2994ea5e2DEeE06A6181f268C3692866C4BE6E9b",
      price: 0.2,
      symbol: "wTENET",
      image: "/wtenet.png",
    },
    pool: {
      pairAddress: "0xE01fAc1f4C479b6aFf9baA26849846AF6b1DA7f6",
      liquidity: 0,
      apr: 0,
      type: PoolType.Stable,
      feeApr: 0,
      rewardApr: 0,
    },
  },
];
