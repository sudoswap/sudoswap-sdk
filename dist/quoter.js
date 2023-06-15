"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quoter = exports.PoolType = void 0;
var PoolType;
(function (PoolType) {
    PoolType[PoolType["NFT"] = 0] = "NFT";
    PoolType[PoolType["TRADE"] = 1] = "TRADE";
    PoolType[PoolType["TOKEN"] = 2] = "TOKEN";
})(PoolType || (exports.PoolType = PoolType = {}));
class Quoter {
    constructor(apiKey) {
        this.getPoolQuery = `items {
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
        this.PROTOCOL_FEE_MULTIPLIER = 5000000000000000;
        this.EXPONENTIAL_CURVE = "0xfa056C602aD0C0C4EE4385b3233f2Cb06730334a";
        this.LINEAR_CURVE = "0xe5d78fec1a7f42d2F3620238C498F088A866FdC5";
        this.XYK_CURVE = "0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5";
        this.apiKey = apiKey;
    }
    parseDefinedResponseToPool(r) {
        let p = {
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
            royalty = royalty * BigInt(Math.pow(10, 16));
            p.royalty = royalty;
        }
        if (r["nftAssets"]) {
            let ids = new Set();
            for (let i of r["nftAssets"]) {
                ids.add(i["tokenId"]);
            }
            p.nftIds = ids;
        }
        if (r["poolNftType"] === "ERC721ERC20" ||
            r["poolNftType"] === "ERC1155ERC20") {
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
    getPoolsForCollection(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let r = yield fetch("https://api.defined.fi", {
                method: "POST",
                body: JSON.stringify({
                    query: `{
          getNftPoolsByCollectionAndExchange(
            collectionAddress: "${address}",
            exchangeAddress: "0xa020d57ab0448ef74115c112d18a9c231cc86000"
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
            let response = yield r.json();
            let pools = [];
            for (let r of response["data"]["getNftPoolsByCollectionAndExchange"]["items"]) {
                pools.push(this.parseDefinedResponseToPool(r));
            }
            pools = pools.filter((x) => {
                let hasTokens = x.tokenBalance > 0;
                let hasNFTs = x.nftBalance > 0;
                let isKnownCurve = x.bondingCurveAddress.toLowerCase() ===
                    this.EXPONENTIAL_CURVE.toLowerCase() ||
                    x.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase() ||
                    x.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase();
                return (hasNFTs || hasTokens) && isKnownCurve;
            });
            return pools;
        });
    }
    getPriceToBuyFromPool(p) {
        let price = undefined;
        if (p.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase()) {
            price = p.spotPrice + p.delta;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.EXPONENTIAL_CURVE.toLowerCase()) {
            price = (p.spotPrice * p.delta) / BigInt(Math.pow(10, 18));
        }
        else if (p.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase()) {
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
            const totalFeeMultiplier = poolFee + royaltyFee + protocolFee + BigInt(Math.pow(10, 18));
            return (price * totalFeeMultiplier) / BigInt(Math.pow(10, 18));
        }
    }
    getPriceToSellToPool(p) {
        let price = undefined;
        if (p.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase()) {
            price = p.spotPrice;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.EXPONENTIAL_CURVE.toLowerCase()) {
            price = p.spotPrice;
        }
        else if (p.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase()) {
            let virtualNFTBalance = p.delta;
            let virtualTokenBalance = p.spotPrice;
            const k = virtualNFTBalance * virtualTokenBalance;
            const newVirtualTokenBalance = k / (virtualNFTBalance + BigInt(1));
            price = virtualTokenBalance - newVirtualTokenBalance;
        }
        if (price) {
            const poolFee = p.fee;
            const protocolFee = BigInt(this.PROTOCOL_FEE_MULTIPLIER);
            const poolAndProtocolFeeAmount = (price * (poolFee + protocolFee)) / BigInt(Math.pow(10, 18));
            const amountToCalculateRoyaltiesFrom = price - poolAndProtocolFeeAmount;
            let royaltyFee = p.royalty;
            const royaltyAmount = (amountToCalculateRoyaltiesFrom * royaltyFee) / BigInt(Math.pow(10, 18));
            const outputAmountMinusTradeFee = price - (price * poolFee / BigInt(Math.pow(10, 18)));
            return {
                outputAmountMinusTradeFee: outputAmountMinusTradeFee,
                amountReceived: price - royaltyAmount - poolAndProtocolFeeAmount
            };
        }
    }
    getBidQuotes(address, id = undefined, quoteTokenAddress = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            let pools = yield this.getPoolsForCollection(address);
            // Filter for ETH by default
            if (!quoteTokenAddress) {
                pools = pools.filter((x) => x.isETHPool);
            }
            // Otherwise, filter for the quote token
            else {
                pools = pools.filter((x) => { var _a; return ((_a = x.tokenAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === quoteTokenAddress.toLowerCase(); });
            }
            // Filter for the specific id if set
            if (id) {
                pools = pools.filter((x) => x.erc1155Id === id);
            }
            // Filter for pools with non-zero NFTs
            pools = pools.filter((x) => x.nftBalance > 0);
            // Initialize quotes for each pool
            let quotes = [];
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
            return quotes.sort((a, b) => a.quote < b.quote ? -1 : a.quote > b.quote ? 1 : 0);
        });
    }
    getAskQuotes(address, id = undefined, quoteTokenAddress = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            let pools = yield this.getPoolsForCollection(address);
            // Filter for ETH by default
            if (!quoteTokenAddress) {
                pools = pools.filter((x) => x.isETHPool);
            }
            // Otherwise, filter for the quote token
            else {
                pools = pools.filter((x) => { var _a; return ((_a = x.tokenAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === quoteTokenAddress.toLowerCase(); });
            }
            // Filter for the specific id if set
            if (id) {
                pools = pools.filter((x) => x.erc1155Id === id);
            }
            // Filter for pools with non-zero token balance
            pools = pools.filter((x) => x.tokenBalance > 0);
            // Initialize quotes for each pool
            let quotes = [];
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
            return quotes.sort((b, a) => a.quote < b.quote ? -1 : a.quote > b.quote ? 1 : 0);
        });
    }
}
exports.Quoter = Quoter;
