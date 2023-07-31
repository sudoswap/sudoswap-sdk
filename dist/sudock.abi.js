"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sudockABI = void 0;
exports.sudockABI = [
    {
        inputs: [
            {
                internalType: "contract ILSSVMPairFactoryLike",
                name: "_FACTORY",
                type: "address",
            },
            { internalType: "address", name: "_SEAPORT", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "OnlySans", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "minimumReceived",
                type: "tuple[]",
            },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "maximumSpent",
                type: "tuple[]",
            },
            { internalType: "bytes", name: "context", type: "bytes" },
        ],
        name: "generateOrder",
        outputs: [
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "offer",
                type: "tuple[]",
            },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    {
                        internalType: "address payable",
                        name: "recipient",
                        type: "address",
                    },
                ],
                internalType: "struct ReceivedItem[]",
                name: "consideration",
                type: "tuple[]",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getSeaportMetadata",
        outputs: [
            { internalType: "string", name: "name", type: "string" },
            {
                components: [
                    { internalType: "uint256", name: "id", type: "uint256" },
                    { internalType: "bytes", name: "metadata", type: "bytes" },
                ],
                internalType: "struct Schema[]",
                name: "schemas",
                type: "tuple[]",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "onERC721Received",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_prevOwner", type: "address" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "onOwnershipTransferred",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "prevOwnerForPair",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "caller", type: "address" },
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "getFromPool",
                type: "tuple[]",
            },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "giveToPool",
                type: "tuple[]",
            },
            { internalType: "bytes", name: "context", type: "bytes" },
        ],
        name: "previewOrder",
        outputs: [
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "offer",
                type: "tuple[]",
            },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    {
                        internalType: "address payable",
                        name: "recipient",
                        type: "address",
                    },
                ],
                internalType: "struct ReceivedItem[]",
                name: "consideration",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                internalType: "struct SpentItem[]",
                name: "",
                type: "tuple[]",
            },
            {
                components: [
                    { internalType: "enum ItemType", name: "itemType", type: "uint8" },
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "uint256", name: "identifier", type: "uint256" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    {
                        internalType: "address payable",
                        name: "recipient",
                        type: "address",
                    },
                ],
                internalType: "struct ReceivedItem[]",
                name: "",
                type: "tuple[]",
            },
            { internalType: "bytes", name: "", type: "bytes" },
            { internalType: "bytes32[]", name: "", type: "bytes32[]" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        name: "ratifyOrder",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "address[]", name: "pairs", type: "address[]" }],
        name: "reclaimPairs",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];
