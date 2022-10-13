import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
dotenv.config();

module.exports = {
	//Specifing Celo Testnet network for smart contract deploying
	networks: {
		celo_alfajores: {
			url: "https://alfajores-forno.celo-testnet.org",
			accounts: [`73e6d3c8393221a8424e4def114864f756763f3bb406c4c0869e5d104ff58d33`],
			chainId: 44787,
			gasPrice: 1000000000
		  },
		
	},
	//Specifing Solidity compiler version
	solidity: {
		compilers: [
			{
				version: '0.7.6',
			},
			{
				version: '0.8.6',
			},
		],
	},
	//Specifing Account to choose for deploying
	namedAccounts: {
		deployer: 0,
	}
};