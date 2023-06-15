# sudo quoter

Uses the [sudoswap Defined API](https://docs.defined.fi/reference/sudoswap-quickstart) to get bid/asks for any NFT.

## Install



## Usage

Create an instance of `Quoter` with your Defined API key. 

Quoter supports getting instant asks (i.e. prices to buy at) and instant bids (i.e. prices to sell at) for any NFT collection listed on sudoswap v2.

Both `getBidQuotes` and `getAskQuotes` have the same function signature:

```
getBidQuotes(
    address: string, // Required, the NFT collection to get quotes for
    id: string | undefined = undefined, // Optional, for ERC1155 listings, filters by a specific ID
    quoteTokenAddress: string | undefined = undefined // Optional, defaults to ETH pools if undefined, otherwise specify a specific token address for pools listed in that token
  ) 
```

Simple use case of getting the immediate pools/prices to sell a Remilio NFT:

```
import { Quoter } from "sudo-defined-quoter";
let q = new Quoter(DEFINED_API_KEY);
let p = await q.getAskQuotes('0xd3d9ddd0cf0a5f0bfb8f7fceae075df687eaebab');

/*
[
  {
    pool: {
      address: '0xcdb8f114d2fb28a4b85bb1ab6e09444006ef5385',
      tokenBalance: 3356524524442673218n,
      spotPrice: 572773849040265576n,
      delta: 1040000000000000000n,
      royalty: 0n,
      nftIds: [Set],
      nftBalance: 9n,
      fee: 20000000000000000n,
      bondingCurveAddress: '0xfa056c602ad0c0c4ee4385b3233f2cb06730334a',
      isETHPool: true,
      tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      poolType: 1
    },
    quote: 558454502814258937n
  },
  {
    pool: {
      address: '0x7a0145ae742ab1c1d5118d6afca5e4e3b120847e',
      tokenBalance: 3018122539957195878n,
      spotPrice: 579647633108523322n,
      delta: 1045000000000000000n,
      royalty: 0n,
      nftIds: [Set],
      nftBalance: 55n,
      fee: 20000000000000000n,
      bondingCurveAddress: '0xfa056c602ad0c0c4ee4385b3233f2cb06730334a',
      isETHPool: true,
      tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      poolType: 1
    },
    quote: 565156442280810239n
  }
]

*/
```