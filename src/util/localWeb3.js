import Web3 from 'web3'
const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545')

let localWeb3 = new Promise(function(resolve, reject) {
    let web3 = new Web3(provider); 
    resolve(web3); 
})

export default localWeb3; 