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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quoter = exports.PoolType = void 0;
var PoolType;
(function (PoolType) {
    PoolType[PoolType["NFT"] = 0] = "NFT";
    PoolType[PoolType["TRADE"] = 1] = "TRADE";
    PoolType[PoolType["TOKEN"] = 2] = "TOKEN";
})(PoolType || (exports.PoolType = PoolType = {}));
var Quoter = /** @class */ (function () {
    function Quoter(apiKey) {
        this.getPoolQuery = "items {\n    acceptedNftTokenIds\n    balanceNBT\n    bondingCurveAddress\n    collectionAddress\n    delta\n    fee\n    nftBalanceV2\n    poolAddress\n    spotPriceT\n    tokenAddress\n    poolType\n    poolVariant\n    propertyChecker\n    poolNftType\n    acceptedNftTokenIds\n    nftAssets {\n      tokenId\n    }\n    royalties {\n      percent\n    }\n  }";
        this.PROTOCOL_FEE_MULTIPLIER = 5000000000000000;
        this.EXPONENTIAL_CURVE = "0xfa056C602aD0C0C4EE4385b3233f2Cb06730334a";
        this.LINEAR_CURVE = "0xe5d78fec1a7f42d2F3620238C498F088A866FdC5";
        this.XYK_CURVE = "0xc7fB91B6cd3C67E02EC08013CEBb29b1241f3De5";
        this.apiKey = apiKey;
    }
    Quoter.prototype.parseDefinedResponseToPool = function (r) {
        var p = {
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
        var royalty = BigInt(0);
        if (r["royalties"]) {
            for (var _i = 0, _a = r["royalties"]; _i < _a.length; _i++) {
                var royaltyPercent = _a[_i];
                royalty = royalty + BigInt(royaltyPercent["percent"]);
            }
            royalty = royalty * BigInt(Math.pow(10, 16));
            p.royalty = royalty;
        }
        if (r["nftAssets"]) {
            var ids = new Set();
            for (var _b = 0, _c = r["nftAssets"]; _b < _c.length; _b++) {
                var i = _c[_b];
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
    };
    Quoter.prototype.getPoolsForCollection = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, pools, _i, _a, r_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("https://api.defined.fi", {
                            method: "POST",
                            body: JSON.stringify({
                                query: "{\n          getNftPoolsByCollectionAndExchange(\n            collectionAddress: \"".concat(address, "\",\n            exchangeAddress: \"0xa020d57ab0448ef74115c112d18a9c231cc86000\"\n            networkId: 1,\n            limit: 500) {\n              ").concat(this.getPoolQuery, "\n            }\n        }"),
                            }),
                            headers: {
                                "x-api-key": this.apiKey,
                            },
                        })];
                    case 1:
                        r = _b.sent();
                        return [4 /*yield*/, r.json()];
                    case 2:
                        response = _b.sent();
                        pools = [];
                        for (_i = 0, _a = response["data"]["getNftPoolsByCollectionAndExchange"]["items"]; _i < _a.length; _i++) {
                            r_1 = _a[_i];
                            pools.push(this.parseDefinedResponseToPool(r_1));
                        }
                        pools = pools.filter(function (x) {
                            var hasTokens = x.tokenBalance > 0;
                            var hasNFTs = x.nftBalance > 0;
                            var isKnownCurve = x.bondingCurveAddress.toLowerCase() ===
                                _this.EXPONENTIAL_CURVE.toLowerCase() ||
                                x.bondingCurveAddress.toLowerCase() === _this.XYK_CURVE.toLowerCase() ||
                                x.bondingCurveAddress.toLowerCase() === _this.LINEAR_CURVE.toLowerCase();
                            return (hasNFTs || hasTokens) && isKnownCurve;
                        });
                        return [2 /*return*/, pools];
                }
            });
        });
    };
    Quoter.prototype.getPriceToBuyFromPool = function (p) {
        var price = undefined;
        if (p.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase()) {
            price = p.spotPrice + p.delta;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.EXPONENTIAL_CURVE.toLowerCase()) {
            price = (p.spotPrice * p.delta) / BigInt(Math.pow(10, 18));
        }
        else if (p.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase()) {
            var virtualNFTBalance = p.delta;
            var virtualTokenBalance = p.spotPrice;
            var k = virtualNFTBalance * virtualTokenBalance;
            var newVirtualTokenBalance = k / (virtualNFTBalance - BigInt(1));
            price = newVirtualTokenBalance - virtualTokenBalance;
        }
        if (price) {
            var poolFee = p.fee;
            var royaltyFee = p.royalty;
            var protocolFee = BigInt(this.PROTOCOL_FEE_MULTIPLIER);
            var totalFeeMultiplier = poolFee + royaltyFee + protocolFee + BigInt(Math.pow(10, 18));
            return (price * totalFeeMultiplier) / BigInt(Math.pow(10, 18));
        }
    };
    Quoter.prototype.getPriceToSellToPool = function (p) {
        var price = undefined;
        if (p.bondingCurveAddress.toLowerCase() === this.LINEAR_CURVE.toLowerCase()) {
            price = p.spotPrice;
        }
        else if (p.bondingCurveAddress.toLowerCase() ===
            this.EXPONENTIAL_CURVE.toLowerCase()) {
            price = p.spotPrice;
        }
        else if (p.bondingCurveAddress.toLowerCase() === this.XYK_CURVE.toLowerCase()) {
            var virtualNFTBalance = p.delta;
            var virtualTokenBalance = p.spotPrice;
            var k = virtualNFTBalance * virtualTokenBalance;
            var newVirtualTokenBalance = k / (virtualNFTBalance + BigInt(1));
            price = virtualTokenBalance - newVirtualTokenBalance;
        }
        if (price) {
            var poolFee = p.fee;
            var protocolFee = BigInt(this.PROTOCOL_FEE_MULTIPLIER);
            var poolAndProtocolFeeAmount = (price * (poolFee + protocolFee)) / BigInt(Math.pow(10, 18));
            var amountToCalculateRoyaltiesFrom = price - poolAndProtocolFeeAmount;
            var royaltyFee = p.royalty;
            var royaltyAmount = (amountToCalculateRoyaltiesFrom * royaltyFee) / BigInt(Math.pow(10, 18));
            var outputAmountMinusTradeFee = price - (price * poolFee / BigInt(Math.pow(10, 18)));
            return {
                outputAmountMinusTradeFee: outputAmountMinusTradeFee,
                amountReceived: price - royaltyAmount - poolAndProtocolFeeAmount
            };
        }
    };
    Quoter.prototype.getBidQuotes = function (address, id, quoteTokenAddress) {
        if (id === void 0) { id = undefined; }
        if (quoteTokenAddress === void 0) { quoteTokenAddress = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var pools, quotes, _i, pools_1, p, quote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPoolsForCollection(address)];
                    case 1:
                        pools = _a.sent();
                        // Filter for ETH by default
                        if (!quoteTokenAddress) {
                            pools = pools.filter(function (x) { return x.isETHPool; });
                        }
                        // Otherwise, filter for the quote token
                        else {
                            pools = pools.filter(function (x) { var _a; return ((_a = x.tokenAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === quoteTokenAddress.toLowerCase(); });
                        }
                        // Filter for the specific id if set
                        if (id) {
                            pools = pools.filter(function (x) { return x.erc1155Id === id; });
                        }
                        // Filter for pools with non-zero NFTs
                        pools = pools.filter(function (x) { return x.nftBalance > 0; });
                        quotes = [];
                        for (_i = 0, pools_1 = pools; _i < pools_1.length; _i++) {
                            p = pools_1[_i];
                            quote = this.getPriceToBuyFromPool(p);
                            if (quote) {
                                quotes.push({
                                    pool: p,
                                    quote: quote,
                                });
                            }
                        }
                        // Return sorted quotes per pool
                        return [2 /*return*/, quotes.sort(function (a, b) {
                                return a.quote < b.quote ? -1 : a.quote > b.quote ? 1 : 0;
                            })];
                }
            });
        });
    };
    Quoter.prototype.getAskQuotes = function (address, id, quoteTokenAddress) {
        if (id === void 0) { id = undefined; }
        if (quoteTokenAddress === void 0) { quoteTokenAddress = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var pools, quotes, _i, pools_2, p, quote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPoolsForCollection(address)];
                    case 1:
                        pools = _a.sent();
                        // Filter for ETH by default
                        if (!quoteTokenAddress) {
                            pools = pools.filter(function (x) { return x.isETHPool; });
                        }
                        // Otherwise, filter for the quote token
                        else {
                            pools = pools.filter(function (x) { var _a; return ((_a = x.tokenAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === quoteTokenAddress.toLowerCase(); });
                        }
                        // Filter for the specific id if set
                        if (id) {
                            pools = pools.filter(function (x) { return x.erc1155Id === id; });
                        }
                        // Filter for pools with non-zero token balance
                        pools = pools.filter(function (x) { return x.tokenBalance > 0; });
                        quotes = [];
                        for (_i = 0, pools_2 = pools; _i < pools_2.length; _i++) {
                            p = pools_2[_i];
                            quote = this.getPriceToSellToPool(p);
                            if (quote && quote.outputAmountMinusTradeFee <= p.tokenBalance) {
                                quotes.push({
                                    pool: p,
                                    quote: quote.amountReceived,
                                });
                            }
                        }
                        // Return sorted quotes per pool
                        return [2 /*return*/, quotes.sort(function (b, a) {
                                return a.quote < b.quote ? -1 : a.quote > b.quote ? 1 : 0;
                            })];
                }
            });
        });
    };
    return Quoter;
}());
exports.Quoter = Quoter;
