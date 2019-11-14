var Users = artifacts.require("./Users.sol");
var Organizations = artifacts.require("./Organizations.sol")
var EthereumDIDRegistry = artifacts.require("./EthereumDIDRegistry.sol")

module.exports = function(deployer) {
  deployer.deploy(Users)
    .then(() => {
       return deployer.deploy(Organizations);
    }).then(() => {
       return deployer.deploy(EthereumDIDRegistry)
    });
};
