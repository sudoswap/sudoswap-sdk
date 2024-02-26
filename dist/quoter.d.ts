export declare const publicClient: {
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    chain: {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    };
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<import("viem").PublicRpcSchema>;
    transport: import("viem").TransportConfig<"http", import("viem").EIP1193RequestFn> & {
        url?: string | undefined;
    };
    type: string;
    uid: string;
    call: (parameters: import("viem").CallParameters<{
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }>) => Promise<import("viem").CallReturnType>;
    createBlockFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | import("viem").RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: import("viem").RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "block";
    }>;
    createContractEventFilter: <TAbi extends readonly unknown[] | import("viem").Abi, TEventName extends string | undefined, TArgs extends import("viem/dist/types/types/contract").MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined, TStrict extends boolean | undefined = undefined>(args: import("viem").CreateContractEventFilterParameters<TAbi, TEventName, TArgs, TStrict>) => Promise<import("viem").CreateContractEventFilterReturnType<TAbi, TEventName, TArgs, TStrict>>;
    createEventFilter: <TAbiEvent extends import("abitype").AbiEvent | undefined, TStrict_1 extends boolean | undefined = undefined, _Abi extends readonly unknown[] | import("viem").Abi = [TAbiEvent], _EventName extends string | undefined = import("viem/dist/types/types/contract").MaybeAbiEventName<TAbiEvent>, _Args extends import("viem/dist/types/types/contract").MaybeExtractEventArgsFromAbi<_Abi, _EventName> | undefined = undefined>(args?: import("viem").CreateEventFilterParameters<TAbiEvent, TStrict_1, _Abi, _EventName, _Args> | undefined) => Promise<import("viem").Filter<"event", _Abi, _EventName, _Args, TStrict_1> extends infer T ? { [K in keyof T]: import("viem").Filter<"event", _Abi, _EventName, _Args, TStrict_1>[K]; } : never>;
    createPendingTransactionFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | import("viem").RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: import("viem").RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "transaction";
    }>;
    estimateContractGas: <TChain extends import("viem").Chain | undefined, TAbi_1 extends readonly unknown[] | import("viem").Abi, TFunctionName extends string>(args: import("viem").EstimateContractGasParameters<TAbi_1, TFunctionName, TChain, import("viem").Account | undefined>) => Promise<bigint>;
    estimateGas: (args: import("viem").EstimateGasParameters<{
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }, import("viem").Account | undefined>) => Promise<bigint>;
    getBalance: (args: import("viem").GetBalanceParameters) => Promise<bigint>;
    getBlock: (args?: import("viem").GetBlockParameters | undefined) => Promise<import("viem").Block>;
    getBlockNumber: (args?: import("viem").GetBlockNumberParameters | undefined) => Promise<bigint>;
    getBlockTransactionCount: (args?: import("viem").GetBlockTransactionCountParameters | undefined) => Promise<number>;
    getBytecode: (args: import("viem").GetBytecodeParameters) => Promise<import("viem").GetBytecodeReturnType>;
    getChainId: () => Promise<number>;
    getEnsAddress: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        coinType?: number | undefined;
        name: string;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsAddressReturnType>;
    getEnsAvatar: (args: {
        name: string;
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
        gatewayUrls?: import("viem").AssetGatewayUrls | undefined;
    }) => Promise<import("viem/dist/types/actions/ens/getEnsAvatar").GetEnsAvatarReturnType>;
    getEnsName: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        address: `0x${string}`;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsNameReturnType>;
    getEnsResolver: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        name: string;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<`0x${string}`>;
    getEnsText: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        name: string;
        key: string;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem/dist/types/actions/ens/getEnsText").GetEnsTextReturnType>;
    getFeeHistory: (args: import("viem").GetFeeHistoryParameters) => Promise<import("viem").GetFeeHistoryReturnType>;
    getFilterChanges: <TFilterType extends import("viem/dist/types/types/filter").FilterType, TAbi_2 extends readonly unknown[] | import("viem").Abi, TEventName_1 extends string | undefined, TStrict_2 extends boolean | undefined = undefined>(args: import("viem").GetFilterChangesParameters<TFilterType, TAbi_2, TEventName_1, TStrict_2>) => Promise<import("viem").GetFilterChangesReturnType<TFilterType, TAbi_2, TEventName_1, TStrict_2>>;
    getFilterLogs: <TAbi_3 extends readonly unknown[] | import("viem").Abi, TEventName_2 extends string | undefined, TStrict_3 extends boolean | undefined = undefined>(args: import("viem").GetFilterLogsParameters<TAbi_3, TEventName_2, TStrict_3>) => Promise<import("viem").GetFilterLogsReturnType<TAbi_3, TEventName_2, TStrict_3>>;
    getGasPrice: () => Promise<bigint>;
    getLogs: <TAbiEvent_1 extends import("abitype").AbiEvent | undefined, TStrict_4 extends boolean | undefined = undefined>(args?: import("viem").GetLogsParameters<TAbiEvent_1, TStrict_4> | undefined) => Promise<import("viem").GetLogsReturnType<TAbiEvent_1, TStrict_4>>;
    getStorageAt: (args: import("viem").GetStorageAtParameters) => Promise<import("viem").GetStorageAtReturnType>;
    getTransaction: (args: import("viem").GetTransactionParameters) => Promise<import("viem").Transaction>;
    getTransactionConfirmations: (args: import("viem").GetTransactionConfirmationsParameters<{
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }>) => Promise<bigint>;
    getTransactionCount: (args: import("viem").GetTransactionCountParameters) => Promise<number>;
    getTransactionReceipt: (args: import("viem").GetTransactionReceiptParameters) => Promise<import("viem").TransactionReceipt>;
    multicall: <TContracts extends import("viem").ContractFunctionConfig[], TAllowFailure extends boolean = true>(args: import("viem").MulticallParameters<TContracts, TAllowFailure>) => Promise<import("viem").MulticallReturnType<TContracts, TAllowFailure>>;
    readContract: <TAbi_4 extends readonly unknown[] | import("viem").Abi, TFunctionName_1 extends string>(args: import("viem").ReadContractParameters<TAbi_4, TFunctionName_1>) => Promise<import("viem").ReadContractReturnType<TAbi_4, TFunctionName_1>>;
    simulateContract: <TAbi_5 extends readonly unknown[] | import("viem").Abi = import("viem").Abi, TFunctionName_2 extends string = any, TChainOverride extends import("viem").Chain | undefined = undefined>(args: import("viem").SimulateContractParameters<TAbi_5, TFunctionName_2, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }, TChainOverride>) => Promise<import("viem").SimulateContractReturnType<TAbi_5, TFunctionName_2, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }, TChainOverride>>;
    verifyMessage: (args: import("viem/dist/types/actions/public/verifyMessage").VerifyMessageParameters) => Promise<boolean>;
    verifyTypedData: (args: import("viem/dist/types/actions/public/verifyTypedData").VerifyTypedDataParameters) => Promise<boolean>;
    uninstallFilter: (args: import("viem").UninstallFilterParameters) => Promise<boolean>;
    waitForTransactionReceipt: (args: import("viem").WaitForTransactionReceiptParameters<{
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }>) => Promise<import("viem").TransactionReceipt>;
    watchBlockNumber: (args: import("viem").WatchBlockNumberParameters) => import("viem").WatchBlockNumberReturnType;
    watchBlocks: (args: import("viem").WatchBlocksParameters<import("viem").HttpTransport, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }>) => import("viem").WatchBlocksReturnType;
    watchContractEvent: <TAbi_6 extends readonly unknown[] | import("viem").Abi, TEventName_3 extends string, TStrict_5 extends boolean | undefined = undefined>(args: import("viem").WatchContractEventParameters<TAbi_6, TEventName_3, TStrict_5>) => import("viem").WatchContractEventReturnType;
    watchEvent: <TAbiEvent_2 extends import("abitype").AbiEvent | undefined, TStrict_6 extends boolean | undefined = undefined>(args: import("viem").WatchEventParameters<TAbiEvent_2, TStrict_6>) => import("viem").WatchEventReturnType;
    watchPendingTransactions: (args: import("viem").WatchPendingTransactionsParameters<import("viem").HttpTransport>) => import("viem").WatchPendingTransactionsReturnType;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    }>(fn: (client: import("viem").Client<import("viem").HttpTransport, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }, undefined, import("viem").PublicRpcSchema, import("viem").PublicActions<import("viem").HttpTransport, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }>>) => client) => import("viem").Client<import("viem").HttpTransport, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }, undefined, import("viem").PublicRpcSchema, { [K_1 in keyof client]: client[K_1]; } & import("viem").PublicActions<import("viem").HttpTransport, {
        readonly id: 1;
        readonly network: "homestead";
        readonly name: "Ethereum";
        readonly nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        readonly rpcUrls: {
            readonly alchemy: {
                readonly http: readonly ["https://eth-mainnet.g.alchemy.com/v2"];
                readonly webSocket: readonly ["wss://eth-mainnet.g.alchemy.com/v2"];
            };
            readonly infura: {
                readonly http: readonly ["https://mainnet.infura.io/v3"];
                readonly webSocket: readonly ["wss://mainnet.infura.io/ws/v3"];
            };
            readonly default: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
            readonly public: {
                readonly http: readonly ["https://cloudflare-eth.com"];
            };
        };
        readonly blockExplorers: {
            readonly etherscan: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
            };
        };
        readonly contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62";
                readonly blockCreated: 16966585;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
    } & {
        formatters: import("viem").Formatters | undefined;
        serializers: import("viem").Serializers<import("viem").Formatters> | undefined;
    }>>;
};
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
    owner: string;
    isSeaportFillable: boolean;
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
    EXPONENTIAL_CURVE: {
        1: string;
        42161: string;
        5: string;
    };
    LINEAR_CURVE: {
        1: string;
        42161: string;
        5: string;
    };
    XYK_CURVE: {
        1: string;
        42161: string;
        5: string;
    };
    GDA_CURVE: {
        1: string;
        42161: string;
        5: string;
    };
    EXCHANGE_ADDRESS: {
        1: string;
        42161: string;
        5: string;
    };
    SUDOCK_ADDRESS: `0x${string}`;
    SEAPORT_ADDRESS: `0x${string}`;
    ZERO_PREFIX: `0x${string}`;
    ZERO_ADDRESS: `0x${string}`;
    ZERO_BYTES: `0x${string}`;
    HALF_PRECISION: number;
    constructor(apiKey: string, chainID?: 1 | 5);
    private parseDefinedResponseToPool;
    getPoolsForCollection(address: string): Promise<Pool[]>;
    private getPriceToBuyFromPool;
    private getPriceToSellToPool;
    getAskQuotes(address: string, id?: string | undefined, quoteTokenAddress?: string | undefined): Promise<PoolQuote[]>;
    getBidQuotes(address: string, id?: string | undefined, quoteTokenAddress?: string | undefined): Promise<PoolQuote[]>;
    previewSudockOrderForERC721Buy(poolAddress: `0x${string}`, nftAddress: `0x${string}`, nftId: string): Promise<readonly [readonly {
        itemType: number;
        token: `0x${string}`;
        identifier: bigint;
        amount: bigint;
    }[], readonly {
        itemType: number;
        token: `0x${string}`;
        identifier: bigint;
        amount: bigint;
        recipient: `0x${string}`;
    }[]]>;
    getSeaportArgsForERC721Buy(poolAddress: `0x${string}`, nftAddress: `0x${string}`, nftId: string): Promise<{
        value: bigint;
        data: `0x${string}`;
    }>;
    calulateGDA(dailyGDAScalar: number, itemScalar: number, startPrice: bigint, poolType: PoolType.NFT | PoolType.TOKEN, startTimeSeconds: bigint | undefined): {
        spotPrice: bigint;
        delta: bigint;
    };
}
