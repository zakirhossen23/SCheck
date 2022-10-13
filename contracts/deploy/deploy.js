
// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'CELO';
	const symbol = 'CELO';

	await deploy('CeloERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['CELO'];
module.exports = func;