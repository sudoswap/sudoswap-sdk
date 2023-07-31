import {
  createPublicClient,
  http,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { mainnet } from "viem/chains";
import { sudockABI } from "./sudock.abi";
import { seaportABI } from "./seaport.abi";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export enum PoolType {
  NFT,
  TRADE,
  TOKEN,
}

export interface Pool {
  address: string;
  spotPrice: bigint;
  delta: bigint;
  tokenBalance: bigint;
  royalty: bigint;
  nftBalance: bigint;
  nftIds: Set<string>;
  bondingCurveAddress: string;
  fee: bigint;
  isETHPool: boolean;
  tokenAddress: string;
  poolType: PoolType;
  erc1155Id?: string;
  owner: string;
  isSeaportFillable: boolean;
}

export interface PoolQuote {
  pool: Pool;
  quote: bigint;
}

export class Quoter {
  getPoolQuery = `items {
    acceptedNftTokenIds
    balanceNBT
    bondingCurveAddress
    collectionAddress
    delta
    fee
    nftBalanceV2
    poolAddress
    spotPriceT
    tokenAddress
    poolType
    poolVariant
    propertyChecker
    poolNftType
    acceptedNftTokenIds
    nftAssets {
      tokenId
    }
    royalties {
      percent
    }
    owner
  }`;

  apiKey: string;
  chainID: 1 | 5;

  PROTOCOL_FEE_MULTIPLIER = 5000000000000000;
  EXPONENTIAL_CURVE = {
    1: "0xfa056C602aD0C0C4EE4385b3233f2Cb06730334a",
    5: "0x60C3aeEb3b8fade6dF3DFdC52A4630D492cDD7e7",
  };
  LINEAR_CURVE = {
    1: "0xe5d78fec1a7f42d2F3620238C498F088A866FdC5",
    5: "0x9fe1E403c043214017a6719c1b64190c634229eF",
  };
  XYK_CURVE = {
    1: "0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5",
    5: "0x8F03234E08A0068572d3AfE10c45d4840d3f29e8",
  };

  EXCHANGE_ADDRESS = {
    1: "0xa020d57ab0448ef74115c112d18a9c231cc86000",
    5: "0x967544b2dd5c1c7a459e810c9b60ae4fc8227201",
  };

  SUDOCK_ADDRESS: `0x${string}` = "0x5be35b691f8275556b05ddf578E491a63C214889";
  SEAPORT_ADDRESS: `0x${string}` = "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC";
  ZERO_PREFIX: `0x${string}` = "0x000000000000000000000000";
  ZERO_ADDRESS: `0x${string}` = "0x0000000000000000000000000000000000000000";
  ZERO_BYTES: `0x${string}` = "0x0000000000000000000000000000000000000000000000000000000000000000";

  constructor(apiKey: string, chainID: 1 | 5 = 1) {
    this.apiKey = apiKey;
    this.chainID = chainID;
  }

  private parseDefinedResponseToPool(r: any): Pool {
    let p: Pool = {
      address: r["poolAddress"],
      tokenBalance: BigInt(r["balanceNBT"]),
      spotPrice: BigInt(r["spotPriceT"]),
      delta: BigInt(r["delta"]),
      royalty: BigInt(0),
      nftIds: new Set(),
      nftBalance: BigInt(r["nftBalanceV2"]),
      fee: BigInt(r["fee"]),
      bondingCurveAddress: r["bondingCurveAddress"],
      isETHPool: true,
      tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      poolType: PoolType.TRADE,
      owner: r["owner"],
      isSeaportFillable:
        r["owner"].toLowerCase() === this.SUDOCK_ADDRESS.toLowerCase(),
    };
    let royaltyNumber = 0;
    if (r["royalties"]) {
      for (const royaltyPercent of r["royalties"]) {
        royaltyNumber = royaltyNumber + parseFloat(royaltyPercent["percent"]);
      }
      let royalty = BigInt(royaltyNumber * 10 ** 16);
      p.royalty = royalty;
    }
    if (r["nftAssets"]) {
      let ids = new Set<string>();
      for (let i of r["nftAssets"]) {
        ids.add(i["tokenId"]);
      }
      p.nftIds = ids;
    }
    if (
      r["poolNftType"] === "ERC721ERC20" ||
      r["poolNftType"] === "ERC1155ERC20"
    ) {
      p.isETHPool = false;
      p.tokenAddress = r["tokenAddress"];
    }
    if (r["poolType"] === "BUY") {
      p.poolType = PoolType.NFT;
    }
    if (r["poolType"] === "SELL") {
      p.poolType = PoolType.TOKEN;
    }
    if (r["acceptedNftTokenIds"]) {
      p.erc1155Id = r["acceptedNftTokenIds"][0];
    }
    return p;
  }

  async getPoolsForCollection(address: string): Promise<Pool[]> {
    let r = await fetch("https://api.defined.fi", {
      method: "POST",
      body: JSON.stringify({
        query: `{
          getNftPoolsByCollectionAndExchange(
            collectionAddress: "${address}",
            exchangeAddress: "${this.EXCHANGE_ADDRESS[this.chainID]}"
            networkId: 1,
            limit: 500) {
              ${this.getPoolQuery}
            }
        }`,
      }),
      headers: {
        "x-api-key": this.apiKey,
      },
    });
    let response = await r.json();
    let pools: Pool[] = [];
    for (let r of response["data"]["getNftPoolsByCollectionAndExchange"][
      "items"
    ]) {
      pools.push(this.parseDefinedResponseToPool(r));
    }
    pools = pools.filter((x) => {
      let hasTokens = x.tokenBalance > 0;
      let hasNFTs = x.nftBalance! > 0;
      let isKnownCurve =
        x.bondingCurveAddress.toLowerCase() ===
          this.EXPONENTIAL_CURVE[this.chainID].toLowerCase() ||
        x.bondingCurveAddress.toLowerCase() ===
          this.XYK_CURVE[this.chainID].toLowerCase() ||
        x.bondingCurveAddress.toLowerCase() ===
          this.LINEAR_CURVE[this.chainID].toLowerCase();
      return (hasNFTs || hasTokens) && isKnownCurve;
    });
    return pools;
  }

  private getPriceToBuyFromPool(p: Pool): bigint | undefined {
    let price: bigint | undefined = undefined;
    if (
      p.bondingCurveAddress.toLowerCase() ===
      this.LINEAR_CURVE[this.chainID].toLowerCase()
    ) {
      price = p.spotPrice + p.delta;
    } else if (
      p.bondingCurveAddress.toLowerCase() ===
      this.EXPONENTIAL_CURVE[this.chainID].toLowerCase()
    ) {
      price = (p.spotPrice * p.delta) / BigInt(10 ** 18);
    } else if (
      p.bondingCurveAddress.toLowerCase() ===
      this.XYK_CURVE[this.chainID].toLowerCase()
    ) {
      let virtualNFTBalance = p.delta;
      let virtualTokenBalance = p.spotPrice;
      const k = virtualNFTBalance * virtualTokenBalance;
      const newVirtualTokenBalance = k / (virtualNFTBalance - BigInt(1));
      price = newVirtualTokenBalance - virtualTokenBalance;
    }
    if (price) {
      const poolFee = p.fee;
      const royaltyFee = p.royalty;
      const protocolFee = BigInt(this.PROTOCOL_FEE_MULTIPLIER);
      const totalFeeMultiplier =
        poolFee + royaltyFee + protocolFee + BigInt(10 ** 18);
      return (price * totalFeeMultiplier) / BigInt(10 ** 18);
    }
  }

  private getPriceToSellToPool(p: Pool) {
    let price: bigint | undefined = undefined;
    if (
      p.bondingCurveAddress.toLowerCase() ===
      this.LINEAR_CURVE[this.chainID].toLowerCase()
    ) {
      price = p.spotPrice;
    } else if (
      p.bondingCurveAddress.toLowerCase() ===
      this.EXPONENTIAL_CURVE[this.chainID].toLowerCase()
    ) {
      price = p.spotPrice;
    } else if (
      p.bondingCurveAddress.toLowerCase() ===
      this.XYK_CURVE[this.chainID].toLowerCase()
    ) {
      let virtualNFTBalance = p.delta;
      let virtualTokenBalance = p.spotPrice;
      const k = virtualNFTBalance * virtualTokenBalance;
      const newVirtualTokenBalance = k / (virtualNFTBalance + BigInt(1));
      price = virtualTokenBalance - newVirtualTokenBalance;
    }
    if (price) {
      const poolFee = p.fee;
      const protocolFee = BigInt(this.PROTOCOL_FEE_MULTIPLIER);
      const poolAndProtocolFeeAmount =
        (price * (poolFee + protocolFee)) / BigInt(10 ** 18);
      const amountToCalculateRoyaltiesFrom = price - poolAndProtocolFeeAmount;
      let royaltyFee = p.royalty;
      const royaltyAmount =
        (amountToCalculateRoyaltiesFrom * royaltyFee) / BigInt(10 ** 18);
      const outputAmountMinusTradeFee =
        price - (price * poolFee) / BigInt(10 ** 18);

      return {
        outputAmountMinusTradeFee: outputAmountMinusTradeFee,
        amountReceived: price - royaltyAmount - poolAndProtocolFeeAmount,
      };
    }
  }

  async getAskQuotes(
    address: string,
    id: string | undefined = undefined,
    quoteTokenAddress: string | undefined = undefined
  ) {
    let pools: Pool[] = await this.getPoolsForCollection(address);

    // Filter for ETH by default
    if (!quoteTokenAddress) {
      pools = pools.filter((x) => x.isETHPool);
    }
    // Otherwise, filter for the quote token
    else {
      pools = pools.filter(
        (x) => x.tokenAddress?.toLowerCase() === quoteTokenAddress.toLowerCase()
      );
    }

    // Filter for the specific id if set
    if (id) {
      pools = pools.filter((x) => x.erc1155Id === id);
    }

    // Filter for pools with non-zero NFTs
    pools = pools.filter((x) => x.nftBalance > 0);

    // Initialize quotes for each pool
    let quotes: PoolQuote[] = [];
    for (let p of pools) {
      let quote = this.getPriceToBuyFromPool(p);
      if (quote) {
        quotes.push({
          pool: p,
          quote: quote,
        });
      }
    }

    // Return sorted quotes per pool
    return quotes.sort((a, b) =>
      a.quote < b.quote ? -1 : a.quote > b.quote ? 1 : 0
    );
  }

  async getBidQuotes(
    address: string,
    id: string | undefined = undefined,
    quoteTokenAddress: string | undefined = undefined
  ) {
    let pools: Pool[] = await this.getPoolsForCollection(address);

    // Filter for ETH by default
    if (!quoteTokenAddress) {
      pools = pools.filter((x) => x.isETHPool);
    }
    // Otherwise, filter for the quote token
    else {
      pools = pools.filter(
        (x) => x.tokenAddress?.toLowerCase() === quoteTokenAddress.toLowerCase()
      );
    }

    // Filter for the specific id if set
    if (id) {
      pools = pools.filter((x) => x.erc1155Id === id);
    }

    // Filter for pools with non-zero token balance
    pools = pools.filter((x) => x.tokenBalance > 0);

    // Initialize quotes for each pool
    let quotes: PoolQuote[] = [];
    for (let p of pools) {
      let quote = this.getPriceToSellToPool(p);
      if (quote && quote.outputAmountMinusTradeFee <= p.tokenBalance) {
        quotes.push({
          pool: p,
          quote: quote.amountReceived,
        });
      }
    }

    // Return sorted quotes per pool
    return quotes.sort((b, a) =>
      a.quote < b.quote ? -1 : a.quote > b.quote ? 1 : 0
    );
  }

  // Queries Sudock to get the on-chain args needed to generate a Seaport order
  async previewSudockOrderForERC721Buy(
    poolAddress: `0x${string}`,
    nftAddress: `0x${string}`,
    nftId: string
  ) {
    const minimumReceived = [
      {
        itemType: 2, // ITEM.TYPE.2 = ERC721
        token: nftAddress,
        identifier: BigInt(nftId),
        amount: BigInt(1),
      },
    ];
    const data = await publicClient.readContract({
      address: this.SUDOCK_ADDRESS,
      abi: sudockABI,
      functionName: "previewOrder",
      args: [
        this.SEAPORT_ADDRESS,
        this.SEAPORT_ADDRESS,
        minimumReceived,
        [],
        encodeAbiParameters(parseAbiParameters("address a"), [poolAddress]),
      ],
    });
    return data;
  }

  async getSeaportArgsForERC721Buy(
    poolAddress: `0x${string}`,
    nftAddress: `0x${string}`,
    nftId: string
  ) {
    const sudockArgs = await this.previewSudockOrderForERC721Buy(
      poolAddress,
      nftAddress,
      nftId
    );
    const advancedOrder: {
      parameters: {
        offerer: `0x${string}`;
        zone: `0x${string}`;
        offer: readonly {
          itemType: number;
          token: `0x${string}`;
          identifierOrCriteria: bigint;
          startAmount: bigint;
          endAmount: bigint;
        }[];
        consideration: readonly {
          itemType: number;
          token: `0x${string}`;
          identifierOrCriteria: bigint;
          startAmount: bigint;
          endAmount: bigint;
          recipient: `0x${string}`;
        }[];
        orderType: number;
        startTime: bigint;
        endTime: bigint;
        zoneHash: `0x${string}`;
        salt: bigint;
        conduitKey: `0x${string}`;
        totalOriginalConsiderationItems: bigint;
      };
      numerator: bigint;
      denominator: bigint;
      signature: `0x${string}`;
      extraData: `0x${string}`;
    } = {
      parameters: {
        offerer: this.SUDOCK_ADDRESS,
        zone: this.ZERO_ADDRESS,
        offer: sudockArgs[0].map((x) => {
          return {
            itemType: x.itemType,
            token: x.token,
            identifierOrCriteria: x.identifier,
            startAmount: x.amount,
            endAmount: x.amount,
          };
        }),
        consideration: sudockArgs[1].map((x) => {
          return {
            itemType: x.itemType,
            token: x.token,
            identifierOrCriteria: x.identifier,
            startAmount: x.amount,
            endAmount: x.amount,
            recipient: x.recipient,
          };
        }),
        orderType: 4,
        startTime: BigInt(Math.floor(Date.now() / 1000)),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 1000),
        zoneHash: this.ZERO_BYTES,
        salt: BigInt(0),
        conduitKey: this.ZERO_BYTES,
        totalOriginalConsiderationItems: BigInt(sudockArgs[0].length + sudockArgs[1].length),
      },
      numerator: BigInt(1),
      denominator: BigInt(1),
      signature: this.ZERO_BYTES,
      extraData: encodeAbiParameters(parseAbiParameters("address a"), [poolAddress])
    };
    const data = encodeFunctionData({
      abi: seaportABI,
      functionName: 'fulfillAdvancedOrder',
      args: [
        advancedOrder,
        [],
        this.ZERO_BYTES,
        this.ZERO_ADDRESS
      ]
    });
    return {
      value: sudockArgs[1].map((x) => x.amount).reduce((x, y) => x + y, BigInt(0)),
      data: data
    }
  }
}
