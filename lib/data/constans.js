module.exports = {
	events: {
		users: {
			add: "createUser",
			password: "changePassword",
		},
		balance: {
			irr: "irrBalance",
		},
		kyc: {
			add: "createKyc",
		},
		auction: {
			buy: "buyAuction",
		},
		match: {
			add: "createMatch",
		},
		order: {
			buy: "buyOrder",
			sell: "sellOrder",
		},
		withdraw: {
			add: "createWithdraw",
			completed: "completedWithdraw",
			reject: "rejectWithdraw",
		},
		deposit: {
			add: "createDeposit",
		},
		income: {
			add: "addIncome",
		},
		wizard: {
			add: "addCardWizard",
		},
		referral: {
			add: "addReferral",
			addReferralCount: "addReferraledCount",
		},
		card: {
			purchase: "cardPurchase",
		},
	},
	BSC: {
		USDT: "0x55d398326f99059ff775485246999027b3197955",
		ETH: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
		STL: "0xaa12db4e58a7e57cb4a3b92e56620a2fd719339b",
		STYL: "0xd1e756a5868fcf56a01befc41a8163a6b4f67f43",
	},
	ETH: {
		USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
		STYL: "0x9924bbad97e0e3d776ee452a221ff0ff3f7a31c5",
	},
	erc721Abi: [
		{
			constant: true,
			inputs: [],
			name: "name",
			outputs: [
				{
					name: "",
					type: "string",
				},
			],
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_spender",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
			],
			name: "approve",
			outputs: [
				{
					name: "success",
					type: "bool",
				},
			],
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "totalSupply",
			outputs: [
				{
					name: "",
					type: "uint256",
				},
			],
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_from",
					type: "address",
				},
				{
					name: "_to",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
			],
			name: "transferFrom",
			outputs: [
				{
					name: "success",
					type: "bool",
				},
			],
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "decimals",
			outputs: [
				{
					name: "",
					type: "uint8",
				},
			],
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "version",
			outputs: [
				{
					name: "",
					type: "string",
				},
			],
			type: "function",
		},
		{
			constant: true,
			inputs: [
				{
					name: "_owner",
					type: "address",
				},
			],
			name: "balanceOf",
			outputs: [
				{
					name: "balance",
					type: "uint256",
				},
			],
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "symbol",
			outputs: [
				{
					name: "",
					type: "string",
				},
			],
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_to",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
			],
			name: "transfer",
			outputs: [
				{
					name: "success",
					type: "bool",
				},
			],
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_spender",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
				{
					name: "_extraData",
					type: "bytes",
				},
			],
			name: "approveAndCall",
			outputs: [
				{
					name: "success",
					type: "bool",
				},
			],
			type: "function",
		},
		{
			constant: true,
			inputs: [
				{
					name: "_owner",
					type: "address",
				},
				{
					name: "_spender",
					type: "address",
				},
			],
			name: "allowance",
			outputs: [
				{
					name: "remaining",
					type: "uint256",
				},
			],
			type: "function",
		},
		{
			constant: false,
			type: "fallback",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					name: "_from",
					type: "address",
				},
				{
					indexed: true,
					name: "_to",
					type: "address",
				},
				{
					indexed: false,
					name: "_value",
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
					indexed: true,
					name: "_owner",
					type: "address",
				},
				{
					indexed: true,
					name: "_spender",
					type: "address",
				},
				{
					indexed: false,
					name: "_value",
					type: "uint256",
				},
			],
			name: "Approval",
			type: "event",
		},
	],
};
