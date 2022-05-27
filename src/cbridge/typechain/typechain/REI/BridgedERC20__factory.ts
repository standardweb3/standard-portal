/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BridgedERC20, BridgedERC20Interface } from "./BridgedERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bridge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supplyCap",
        type: "uint256",
      },
    ],
    name: "MinterCapUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAUSER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "minterSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "cap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "cap",
        type: "uint256",
      },
    ],
    name: "setMinterCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620020003803806200200083398101604081905262000034916200039f565b8251839083906200004d90600390602085019062000246565b5080516200006390600490602084019062000246565b50506005805460ff191690555060f881901b7fff0000000000000000000000000000000000000000000000000000000000000016608052620000a86000335b620000dd565b620000d47f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000a2565b50505062000473565b620000e98282620000ed565b5050565b6200010482826200013060201b62000b8b1760201c565b60008281526007602090815260409091206200012b91839062000c11620001d4821b17901c565b505050565b60008281526006602090815260408083206001600160a01b038516845290915290205460ff16620000e95760008281526006602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620001903390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000620001eb836001600160a01b038416620001f4565b90505b92915050565b60008181526001830160205260408120546200023d57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620001ee565b506000620001ee565b828054620002549062000420565b90600052602060002090601f016020900481019282620002785760008555620002c3565b82601f106200029357805160ff1916838001178555620002c3565b82800160010185558215620002c3579182015b82811115620002c3578251825591602001919060010190620002a6565b50620002d1929150620002d5565b5090565b5b80821115620002d15760008155600101620002d6565b600082601f830112620002fd578081fd5b81516001600160401b03808211156200031a576200031a6200045d565b604051601f8301601f19908116603f011681019082821181831017156200034557620003456200045d565b8160405283815260209250868385880101111562000361578485fd5b8491505b8382101562000384578582018301518183018401529082019062000365565b838211156200039557848385830101525b9695505050505050565b600080600060608486031215620003b4578283fd5b83516001600160401b0380821115620003cb578485fd5b620003d987838801620002ec565b94506020860151915080821115620003ef578384fd5b50620003fe86828701620002ec565b925050604084015160ff8116811462000415578182fd5b809150509250925092565b6002810460018216806200043557607f821691505b602082108114156200045757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160f81c611b6e62000492600039600061029e0152611b6e6000f3fe608060405234801561001057600080fd5b50600436106101e55760003560e01c806379cc67901161010f578063a457c2d7116100a2578063d539139311610071578063d539139314610454578063d547741f1461047b578063dd62ed3e1461048e578063e63ab1e9146104c7576101e5565b8063a457c2d714610408578063a9059cbb1461041b578063c8e1b4ce1461042e578063ca15c87314610441576101e5565b806395609212116100de57806395609212146103a957806395d89b41146103e55780639dc29fac146103ed578063a217fddf14610400576101e5565b806379cc6790146103505780638456cb59146103635780639010d07c1461036b57806391d1485414610396576101e5565b8063313ce5671161018757806340c10f191161015657806340c10f19146102f657806342966c68146103095780635c975abb1461031c57806370a0823114610327576101e5565b8063313ce5671461029757806336568abe146102c857806339509351146102db5780633f4ba83a146102ee576101e5565b806318160ddd116101c357806318160ddd1461023a57806323b872dd1461024c578063248a9ca31461025f5780632f2ff15d14610282576101e5565b806301ffc9a7146101ea57806306fdde0314610212578063095ea7b314610227575b600080fd5b6101fd6101f8366004611986565b6104ee565b60405190151581526020015b60405180910390f35b61021a61051b565b6040516102099190611a23565b6101fd610235366004611902565b6105ad565b6002545b604051908152602001610209565b6101fd61025a3660046118c7565b6105c7565b61023e61026d36600461192b565b60009081526006602052604090206001015490565b610295610290366004611943565b6105eb565b005b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610209565b6102956102d6366004611943565b610617565b6101fd6102e9366004611902565b61069a565b6102956106d9565b610295610304366004611902565b610770565b61029561031736600461192b565b61088c565b60055460ff166101fd565b61023e61033536600461187b565b6001600160a01b031660009081526020819052604090205490565b61029561035e366004611902565b610899565b610295610953565b61037e610379366004611965565b6109e6565b6040516001600160a01b039091168152602001610209565b6101fd6103a4366004611943565b610a05565b6103d06103b736600461187b565b6008602052600090815260409020805460019091015482565b60408051928352602083019190915201610209565b61021a610a30565b6102956103fb366004611902565b610a3f565b61023e600081565b6101fd610416366004611902565b610a49565b6101fd610429366004611902565b610adb565b61029561043c366004611902565b610ae9565b61023e61044f36600461192b565b610b4e565b61023e7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b610295610489366004611943565b610b65565b61023e61049c366004611895565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61023e7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b03198216635a05180f60e01b1480610513575061051382610c26565b90505b919050565b60606003805461052a90611ae7565b80601f016020809104026020016040519081016040528092919081815260200182805461055690611ae7565b80156105a35780601f10610578576101008083540402835291602001916105a3565b820191906000526020600020905b81548152906001019060200180831161058657829003601f168201915b5050505050905090565b6000336105bb818585610c5b565b60019150505b92915050565b6000336105d5858285610d7f565b6105e0858585610e11565b506001949350505050565b60008281526006602052604090206001015461060881335b610fea565b610612838361104e565b505050565b6001600160a01b038116331461068c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6106968282611070565b5050565b3360008181526001602090815260408083206001600160a01b03871684529091528120549091906105bb90829086906106d4908790611a56565b610c5b565b6107037f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a336103a4565b6107665760405162461bcd60e51b815260206004820152602e60248201527f4272696467656445524332303a206d757374206861766520706175736572207260448201526d6f6c6520746f20756e706175736560901b6064820152608401610683565b61076e611092565b565b61079a7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6336103a4565b6107fa5760405162461bcd60e51b815260206004820152602b60248201527f4272696467656445524332303a206d7573742068617665206d696e746572207260448201526a1bdb19481d1bc81b5a5b9d60aa1b6064820152608401610683565b3360009081526008602052604081206001810180549192849261081e908490611a56565b90915550508054600182015411156108825760405162461bcd60e51b815260206004820152602160248201527f4272696467656445524332303a206d696e7465722063617020657863656564656044820152601960fa1b6064820152608401610683565b6106128383611125565b6108963382611211565b50565b33600090815260086020526040902080541515806108bb575060008160010154115b1561093e5781816001015410156109325760405162461bcd60e51b815260206004820152603560248201527f4272696467656445524332303a206275726e20616d6f756e742065786365656460448201527473206d696e74657220746f74616c20737570706c7960581b6064820152608401610683565b60018101805483900390555b610949833384610d7f565b6106128383611211565b61097d7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a336103a4565b6109de5760405162461bcd60e51b815260206004820152602c60248201527f4272696467656445524332303a206d757374206861766520706175736572207260448201526b6f6c6520746f20706175736560a01b6064820152608401610683565b61076e61136b565b60008281526007602052604081206109fe90836113e6565b9392505050565b60009182526006602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60606004805461052a90611ae7565b6106968282610899565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919083811015610ace5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610683565b6105e08286868403610c5b565b6000336105bb818585610e11565b6000610af58133610603565b6001600160a01b038316600081815260086020908152604091829020859055815192835282018490527f9917e077a26c11e709ef1e3646df334b6146e2b10a05501633864b047c53432c910160405180910390a1505050565b6000818152600760205260408120610513906113f2565b600082815260066020526040902060010154610b818133610603565b6106128383611070565b610b958282610a05565b6106965760008281526006602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610bcd3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006109fe836001600160a01b0384166113fc565b60006001600160e01b03198216637965db0b60e01b148061051357506301ffc9a760e01b6001600160e01b0319831614610513565b6001600160a01b038316610cbd5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610683565b6001600160a01b038216610d1e5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610683565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610e0b5781811015610dfe5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610683565b610e0b8484848403610c5b565b50505050565b6001600160a01b038316610e755760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610683565b6001600160a01b038216610ed75760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610683565b610ee283838361144b565b6001600160a01b03831660009081526020819052604090205481811015610f5a5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610683565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610f91908490611a56565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610fdd91815260200190565b60405180910390a3610e0b565b610ff48282610a05565b6106965761100c816001600160a01b031660146114b1565b6110178360206114b1565b6040516020016110289291906119ae565b60408051601f198184030181529082905262461bcd60e51b825261068391600401611a23565b6110588282610b8b565b60008281526007602052604090206106129082610c11565b61107a8282611693565b600082815260076020526040902061061290826116fa565b60055460ff166110db5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610683565b6005805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b03821661117b5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610683565b6111876000838361144b565b80600260008282546111999190611a56565b90915550506001600160a01b038216600090815260208190526040812080548392906111c6908490611a56565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3610696565b6001600160a01b0382166112715760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610683565b61127d8260008361144b565b6001600160a01b038216600090815260208190526040902054818110156112f15760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610683565b6001600160a01b0383166000908152602081905260408120838303905560028054849290611320908490611a8d565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3610612565b60055460ff16156113b15760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610683565b6005805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586111083390565b60006109fe838361170f565b6000610513825490565b6000818152600183016020526040812054611443575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556105c1565b5060006105c1565b60055460ff16156106125760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b6064820152608401610683565b606060006114c0836002611a6e565b6114cb906002611a56565b67ffffffffffffffff8111156114f157634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f19166020018201604052801561151b576020820181803683370190505b509050600360fc1b8160008151811061154457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061158157634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006115a5846002611a6e565b6115b0906001611a56565b90505b6001811115611644576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106115f257634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061161657634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361163d81611ad0565b90506115b3565b5083156109fe5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610683565b61169d8282610a05565b156106965760008281526006602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60006109fe836001600160a01b038416611747565b600082600001828154811061173457634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b6000818152600183016020526040812054801561185a57600061176b600183611a8d565b855490915060009061177f90600190611a8d565b90508181146118005760008660000182815481106117ad57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050808760000184815481106117de57634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061181f57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506105c1565b60009150506105c1565b80356001600160a01b038116811461051657600080fd5b60006020828403121561188c578081fd5b6109fe82611864565b600080604083850312156118a7578081fd5b6118b083611864565b91506118be60208401611864565b90509250929050565b6000806000606084860312156118db578081fd5b6118e484611864565b92506118f260208501611864565b9150604084013590509250925092565b60008060408385031215611914578182fd5b61191d83611864565b946020939093013593505050565b60006020828403121561193c578081fd5b5035919050565b60008060408385031215611955578182fd5b823591506118be60208401611864565b60008060408385031215611977578182fd5b50508035926020909101359150565b600060208284031215611997578081fd5b81356001600160e01b0319811681146109fe578182fd5b60007f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000825283516119e6816017850160208801611aa4565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611a17816028840160208801611aa4565b01602801949350505050565b6000602082528251806020840152611a42816040850160208701611aa4565b601f01601f19169190910160400192915050565b60008219821115611a6957611a69611b22565b500190565b6000816000190483118215151615611a8857611a88611b22565b500290565b600082821015611a9f57611a9f611b22565b500390565b60005b83811015611abf578181015183820152602001611aa7565b83811115610e0b5750506000910152565b600081611adf57611adf611b22565b506000190190565b600281046001821680611afb57607f821691505b60208210811415611b1c57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220c22daf3e9fab5d59de5f0a09a74e39e340ec0da9d1b71844c9489fa4a3668ddb64736f6c63430008020033";

type BridgedERC20ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: BridgedERC20ConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class BridgedERC20__factory extends ContractFactory {
  constructor(...args: BridgedERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name: string,
    symbol: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<BridgedERC20> {
    return super.deploy(name, symbol, decimals_, overrides || {}) as Promise<BridgedERC20>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, decimals_, overrides || {});
  }
  attach(address: string): BridgedERC20 {
    return super.attach(address) as BridgedERC20;
  }
  connect(signer: Signer): BridgedERC20__factory {
    return super.connect(signer) as BridgedERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BridgedERC20Interface {
    return new utils.Interface(_abi) as BridgedERC20Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): BridgedERC20 {
    return new Contract(address, _abi, signerOrProvider) as BridgedERC20;
  }
}
