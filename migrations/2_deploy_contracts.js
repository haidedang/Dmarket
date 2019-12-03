var EthereumDIDRegistry = artifacts.require("./ERC1056.sol")
var ClaimRegistry = artifacts.require("./ERC780.sol")
var MarketPlaceCore = artifacts.require("./MarketPlaceCore.sol")

module.exports = function(deployer) {
  let market
  deployer.deploy(EthereumDIDRegistry)
    .then(() => {
      return deployer.deploy(ClaimRegistry)  
    })
    .then(() => {
      return deployer.deploy(MarketPlaceCore, EthereumDIDRegistry.address, ClaimRegistry.address);
    })
};
