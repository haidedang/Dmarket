// Client Browser web3

import Web3 from 'web3' 

let getWeb3 = new Promise(function (resolve, reject) {

  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      ethereum.enable();
    } catch (error) {
      // User denied account access...
    }
  } else if (window.web3) { // Legacy dapp browsers...
    window.web3 = new Web3(web3.currentProvider);
  } else { // Non-dapp browsers...
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
  
  resolve(web3);
  
})

export default getWeb3