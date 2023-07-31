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
exports.Quoter = exports.PoolType = exports.publicClient = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const sudock_abi_1 = require("./sudock.abi");
const seaport_abi_1 = require("./seaport.abi");
exports.publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)(),
});
var PoolType;
(function (PoolType) {
    PoolType[PoolType["NFT"] = 0] = "NFT";
    PoolType[PoolType["TRADE"] = 1] = "TRADE";
    PoolType[PoolType["TOKEN"] = 2] = "TOKEN";
})(PoolType || (exports.PoolType = PoolType = {}));
class Quoter {
    constructor(apiKey, chainID = 1) {
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
    owner
  }`;
        this.PROTOCOL_FEE_MULTIPLIER = 5000000000000000;
        this.EXPONENTIAL_CURVE = {
            1: "0xfa056C602aD0C0C4EE4385b3233f2Cb06730334a",
            5: "0x60C3aeEb3b8fade6dF3DFdC52A4630D492cDD7e7",
        };
        this.LINEAR_CURVE = {
            1: "0xe5d78fec1a7f42d2F3620238C498F088A866FdC5",
            5: "0x9fe1E403c043214017a6719c1b64190c634229eF",
        };
        this.XYK_CURVE = {
            1: "0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5",
            5: "0x8F03234E08A0068572d3AfE10c45d4840d3f29e8",
        };
        this.EXCHANGE_ADDRESS = {
            1: "0xa020d57ab0448ef74115c112d18a9c231cc86000",
            5: "0x967544b2dd5c1c7a459e810c9b60ae4fc8227201",
        };
        this.SUDOCK_ADDRESS = "0x5be35b691f8275556b05ddf578E491a63C214889";
        this.SEAPORT_ADDRESS = "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC";
        this.ZERO_PREFIX = "0x000000000000000000000000";
        this.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
        this.ZERO_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
        this.apiKey = apiKey;
        this.chainID = chainID;
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
            owner: r["owner"],
            isSeaportFillable: r["owner"].toLowerCase() === this.SUDOCK_ADDRESS.toLowerCase(),
        };
        let royaltyNumber = 0;
        if (r["royalties"]) {
            for (const royaltyPercent of r["royalties"]) {
                royaltyNumber = royaltyNumber + parseFloat(royaltyPercent["percent"]);
            }
            let royalty = BigInt(royaltyNumber * Math.pow(10, 16));
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
            let response = yield r.json();
            let pools = [];
            for (let r of response["data"]["getNftPoolsByCollectionAndExchange"]["items"]) {
                pools.push(this.parseDefinedResponseToPool(r));
            }
            pools = pools.filter((x) => {
                let hasTokens = x.tokenBalance > 0;
                let hasNFTs = x.nftBalance > 0;
                let isKnownCurve = x.bondingCurveAddress.toLowerCase() ===
                    this.EXPONENTIAL_CURVE[this.chainID].toLowerCase() ||
                    x.bondingCurveAddress.toLowerCase() ===
                        this.XYK_CURVE[this.chainID].toLowerCase() ||
                    x.bondingCurveAddress.toLowerCase() ===
                        this.LINEAR_CURVE[this.chainID].toLowerCase();
                return (hasNFTs || hasTokens) && isKnownCurve;
            });
            return pools;
        });
    }
    getPriceToBuyFromPool(p) {
        let price = undefined;
        if (p.bondingCurveAddress.toLowerCase() ===
            this.LINEAR_CURVE[this.chainID].toLowerCase()) {
            price = p.spotPrice + p.delta;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.EXPONENTIAL_CURVE[this.chainID].toLowerCase()) {
            price = (p.spotPrice * p.delta) / BigInt(Math.pow(10, 18));
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.XYK_CURVE[this.chainID].toLowerCase()) {
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
        if (p.bondingCurveAddress.toLowerCase() ===
            this.LINEAR_CURVE[this.chainID].toLowerCase()) {
            price = p.spotPrice;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.EXPONENTIAL_CURVE[this.chainID].toLowerCase()) {
            price = p.spotPrice;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.XYK_CURVE[this.chainID].toLowerCase()) {
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
            const outputAmountMinusTradeFee = price - (price * poolFee) / BigInt(Math.pow(10, 18));
            return {
                outputAmountMinusTradeFee: outputAmountMinusTradeFee,
                amountReceived: price - royaltyAmount - poolAndProtocolFeeAmount,
            };
        }
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
    // Queries Sudock to get the on-chain args needed to generate a Seaport order
    previewSudockOrderForERC721Buy(poolAddress, nftAddress, nftId) {
        return __awaiter(this, void 0, void 0, function* () {
            const minimumReceived = [
                {
                    itemType: 2,
                    token: nftAddress,
                    identifier: BigInt(nftId),
                    amount: BigInt(1),
                },
            ];
            const data = yield exports.publicClient.readContract({
                address: this.SUDOCK_ADDRESS,
                abi: sudock_abi_1.sudockABI,
                functionName: "previewOrder",
                args: [
                    this.SEAPORT_ADDRESS,
                    this.SEAPORT_ADDRESS,
                    minimumReceived,
                    [],
                    (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("address a"), [poolAddress]),
                ],
            });
            return data;
        });
    }
    getSeaportArgsForERC721Buy(poolAddress, nftAddress, nftId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sudockArgs = yield this.previewSudockOrderForERC721Buy(poolAddress, nftAddress, nftId);
            const advancedOrder = {
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
                    totalOriginalConsiderationItems: BigInt(sudockArgs[1].length),
                },
                numerator: BigInt(1),
                denominator: BigInt(1),
                signature: this.ZERO_BYTES,
                extraData: (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("address a"), [poolAddress])
            };
            const data = (0, viem_1.encodeFunctionData)({
                abi: seaport_abi_1.seaportABI,
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
            };
        });
    }
}
exports.Quoter = Quoter;
