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
const axios_1 = require("axios");
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
            42161: "0x0A25f1711F709Cdc603f5cbc2B5a5c76EcC26a3c",
            5: "0x60C3aeEb3b8fade6dF3DFdC52A4630D492cDD7e7",
            8453: "0x9506C0E5CEe9AD1dEe65B3539268D61CCB25aFB6",
            1996: "0x0A25f1711F709Cdc603f5cbc2B5a5c76EcC26a3c"
        };
        this.LINEAR_CURVE = {
            1: "0xe5d78fec1a7f42d2F3620238C498F088A866FdC5",
            42161: "0x93029Eb6B57289B3EbEe3fB359d8070f42804a06",
            5: "0x9fe1E403c043214017a6719c1b64190c634229eF",
            8453: "0xe41352CB8D9af18231E05520751840559C2a548A",
            1996: "0x93029Eb6B57289B3EbEe3fB359d8070f42804a06"
        };
        this.XYK_CURVE = {
            1: "0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5",
            42161: "0x31F85DDAB4b77a553D2D4aF38bbA3e3CB7E425c9",
            5: "0x8F03234E08A0068572d3AfE10c45d4840d3f29e8",
            8453: "0xd0A2f4ae5E816ec09374c67F6532063B60dE037B",
            1996: "0x31F85DDAB4b77a553D2D4aF38bbA3e3CB7E425c9"
        };
        this.GDA_CURVE = {
            1: "0x1fD5876d4A3860Eb0159055a3b7Cb79fdFFf6B67",
            42161: "0x84e18157B9ec715FdD114a5B9f17D0b790363C27",
            5: "0x5e9a0Ef66A6BC2E6Ac7C9811374521f7BAd89e53",
            8453: "0x4f1627be4C72aEB9565D4c751550C4D262a96B51",
            1996: "0x84e18157B9ec715FdD114a5B9f17D0b790363C27"
        };
        this.EXCHANGE_ADDRESS = {
            1: "0xa020d57ab0448ef74115c112d18a9c231cc86000",
            42161: "0x4f1627be4C72aEB9565D4c751550C4D262a96B51",
            5: "0x967544b2dd5c1c7a459e810c9b60ae4fc8227201",
            8453: "0x605145d263482684590f630e9e581b21e4938eb8",
            1996: "0x5bfE2ef160EaaAa4aFa89A8fa09775b6580162c9"
        };
        this.SUDOCK_ADDRESS = "0x5be35b691f8275556b05ddf578E491a63C214889";
        this.SEAPORT_ADDRESS = "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC";
        this.ZERO_PREFIX = "0x000000000000000000000000";
        this.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
        this.ZERO_BYTES = "0x0000000000000000000000000000000000000000000000000000000000000000";
        this.HALF_PRECISION = 1e9;
        this.apiKey = apiKey;
        this.chainID = chainID;
    }
    scientificToBigInt(valueToDecode) {
        if (!valueToDecode.includes("e+")) {
            return BigInt(valueToDecode);
        }
        else {
            // Split the string into coefficient and exponent parts
            let [coefficient, exponent] = valueToDecode.toLowerCase().split("e");
            // Parse the coefficient and exponent
            let coeffBigInt = BigInt(coefficient.replace(".", ""));
            let exponentValue = parseInt(exponent);
            // Append zeros to the coefficient according to the exponent
            for (let i = 0; i < exponentValue; i++) {
                coeffBigInt *= BigInt(10);
            }
            return coeffBigInt;
        }
    }
    parseDefinedResponseToPool(r) {
        let p = {
            address: r["poolAddress"],
            tokenBalance: BigInt(r["balanceNBT"]),
            spotPrice: this.scientificToBigInt(r["spotPriceT"]).valueOf(),
            delta: this.scientificToBigInt(r["delta"]).valueOf(),
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
            let response = yield axios_1.default.post("https://graph.defined.fi/graphql", {
                query: `{
          getNftPoolsByCollectionAndExchange(
            collectionAddress: "${address}",
            exchangeAddress: "${this.EXCHANGE_ADDRESS[this.chainID]}"
            networkId: 1,
            limit: 500) {
              ${this.getPoolQuery}
            }
        }`,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.apiKey,
                },
            });
            let pools = [];
            for (let r of response["data"]["data"]["getNftPoolsByCollectionAndExchange"]["items"]) {
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
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.GDA_CURVE[this.chainID].toLowerCase()) {
            let fullDeltaBinary = p.delta.toString(2);
            if (fullDeltaBinary.length < 128) {
                fullDeltaBinary =
                    "0".repeat(128 - fullDeltaBinary.length) + fullDeltaBinary;
            }
            const delta = BigInt("0b" + fullDeltaBinary.slice(0, 40));
            const lambda = BigInt("0b" + fullDeltaBinary.slice(40, 80));
            const lastTime = BigInt(parseInt(fullDeltaBinary.slice(80), 2));
            const currentTime = BigInt(Math.round(Date.now() / 1000));
            const timeElapsed = currentTime - lastTime;
            let fullLambda = Number(lambda * timeElapsed) / this.HALF_PRECISION;
            if (fullLambda > 20) {
                fullLambda = 20;
            }
            const scaleFactor = Math.pow(2, fullLambda);
            price = BigInt(Number(p.spotPrice) / scaleFactor);
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
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.GDA_CURVE[this.chainID].toLowerCase()) {
            let fullDeltaBinary = p.delta.toString(2);
            if (fullDeltaBinary.length < 128) {
                fullDeltaBinary =
                    "0".repeat(128 - fullDeltaBinary.length) + fullDeltaBinary;
            }
            const delta = BigInt("0b" + fullDeltaBinary.slice(0, 40));
            const lambda = BigInt("0b" + fullDeltaBinary.slice(40, 80));
            const lastTime = BigInt(parseInt(fullDeltaBinary.slice(80), 2));
            const currentTime = BigInt(Math.round(Date.now() / 1000));
            const timeElapsed = currentTime - lastTime;
            let fullLambda = Number(lambda * timeElapsed) / this.HALF_PRECISION;
            if (fullLambda > 20) {
                fullLambda = 20;
            }
            const scaleFactor = Math.pow(2, fullLambda);
            // Scale down by delta for 1 tick
            price =
                BigInt(Number(p.spotPrice) * scaleFactor) /
                    (delta * BigInt(this.HALF_PRECISION));
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
                extraData: (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("address a"), [
                    poolAddress,
                ]),
            };
            const data = (0, viem_1.encodeFunctionData)({
                abi: seaport_abi_1.seaportABI,
                functionName: "fulfillAdvancedOrder",
                args: [advancedOrder, [], this.ZERO_BYTES, this.ZERO_ADDRESS],
            });
            return {
                value: sudockArgs[1]
                    .map((x) => x.amount)
                    .reduce((x, y) => x + y, BigInt(0)),
                data: data,
            };
        });
    }
    calulateGDA(dailyGDAScalar, itemScalar, startPrice, poolType, startTimeSeconds) {
        if (!startTimeSeconds) {
            startTimeSeconds = BigInt(Math.floor(Date.now() / 1000));
        }
        const alpha = BigInt(itemScalar * 1e9);
        let alpha40bits = alpha.toString(2);
        if (alpha40bits.length < 40) {
            const zeroPrefix = "0".repeat(40 - alpha40bits.length);
            alpha40bits = zeroPrefix + alpha40bits;
        }
        const deltaFromPercentToUnit = dailyGDAScalar;
        const DAY_DIVIDER = 1 / 84600;
        // Fill in magic numbers
        let lambda;
        if (dailyGDAScalar === 2) {
            lambda = 11574;
        }
        else if (dailyGDAScalar === 1.5) {
            lambda = 6770;
        }
        else if (dailyGDAScalar === 4 / 3 || dailyGDAScalar === 1.33) {
            lambda = 4802;
        }
        else {
            lambda =
                Math.log2(deltaFromPercentToUnit) * this.HALF_PRECISION * DAY_DIVIDER;
        }
        let lambda40bits = lambda.toString(2);
        if (lambda40bits.length < 40) {
            const zeroPrefix = "0".repeat(40 - lambda40bits.length);
            lambda40bits = zeroPrefix + lambda40bits;
        }
        const timestampSeconds = BigInt(startTimeSeconds);
        let time48bits = timestampSeconds.toString(2);
        if (time48bits.length < 48) {
            const zeroPrefix = "0".repeat(48 - time48bits.length);
            time48bits = zeroPrefix + time48bits;
        }
        const fullDelta = BigInt("0b" + alpha40bits + lambda40bits + time48bits);
        if (poolType === PoolType.TOKEN) {
            startPrice =
                startPrice / BigInt(itemScalar * Number(this.HALF_PRECISION));
        }
        return {
            spotPrice: startPrice,
            delta: fullDelta,
        };
    }
}
exports.Quoter = Quoter;
