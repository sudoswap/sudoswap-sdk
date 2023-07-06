export declare enum PoolType {
    NFT = 0,
    TRADE = 1,
    TOKEN = 2
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
export declare class Quoter {
    getPoolQuery: string;
    apiKey: string;
    chainID: 1 | 5;
    PROTOCOL_FEE_MULTIPLIER: number;
    EXPONENTIAL_CURVE: string;
    LINEAR_CURVE: string;
    XYK_CURVE: string;
    EXCHANGE_ADDRESS: {
        1: string;
        5: string;
    };
    constructor(apiKey: string, chainID?: 1 | 5);
    private parseDefinedResponseToPool;
    getPoolsForCollection(address: string): Promise<Pool[]>;
    private getPriceToBuyFromPool;
    private getPriceToSellToPool;
    getBidQuotes(address: string, id?: string | undefined, quoteTokenAddress?: string | undefined): Promise<PoolQuote[]>;
    getAskQuotes(address: string, id?: string | undefined, quoteTokenAddress?: string | undefined): Promise<PoolQuote[]>;
}
