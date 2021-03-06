require('babel-register');
require('babel-polyfill');


module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: '0.5.12'
    }
  }
};