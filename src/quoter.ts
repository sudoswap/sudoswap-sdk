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
  }`;

  apiKey: string;
  chainID: 1 | 5;

  PROTOCOL_FEE_MULTIPLIER = 5000000000000000;
  EXPONENTIAL_CURVE = "0xfa056C602aD0C0C4EE4385b3233f2Cb06730334a";
  LINEAR_CURVE = "0xe5d78fec1a7f42d2F3620238C498F088A866FdC5";
  XYK_CURVE = "0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5";

  EXCHANGE_ADDRESS = {
    1: "0xa020d57ab0448ef74115c112d18a9c231cc86000",
    5: "0x967544b2dd5c1c7a459e810c9b60ae4fc8227201"
  };

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
    };
    let royalty = BigInt(0);
    if (r["royalties"]) {
      for (const royaltyPercent of r["royalties"]) {
        royalty = royalty + BigInt(royaltyPercent["percent"]);
      }
      royalty = royalty * BigInt(10 ** 16);
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
          this.EXPONENTIAL_CURVE.toLowerCase() ||
        x.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase() ||
        x.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase();
      return (hasNFTs || hasTokens) && isKnownCurve;
    });
    return pools;
  }

  private getPriceToBuyFromPool(p: Pool): bigint | undefined {
    let price: bigint | undefined = undefined;
    if (
      p.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase()
    ) {
      price = p.spotPrice + p.delta;
    } else if (
      p.bondingCurveAddress.toLowerCase() ===
      this.EXPONENTIAL_CURVE.toLowerCase()
    ) {
      price = (p.spotPrice * p.delta) / BigInt(10 ** 18);
    } else if (
      p.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase()
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
      p.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase()
    ) {
      price = p.spotPrice;
    } else if (
      p.bondingCurveAddress.toLowerCase() ===
      this.EXPONENTIAL_CURVE.toLowerCase()
    ) {
      price = p.spotPrice;
    } else if (
      p.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase()
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
      const poolAndProtocolFeeAmount = (price * (poolFee + protocolFee)) / BigInt(10**18);
      const amountToCalculateRoyaltiesFrom = price - poolAndProtocolFeeAmount;
      let royaltyFee = p.royalty;
      const royaltyAmount = (amountToCalculateRoyaltiesFrom * royaltyFee) / BigInt(10**18);
      const outputAmountMinusTradeFee = price - (price * poolFee / BigInt(10**18));

      return {
        outputAmountMinusTradeFee: outputAmountMinusTradeFee,
        amountReceived: price - royaltyAmount - poolAndProtocolFeeAmount
      };
    }
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
}
