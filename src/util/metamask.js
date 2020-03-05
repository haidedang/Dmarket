
import Web3 from 'web3' 

class MetaMask {
     static async getWeb3() {
        return new Promise(function(resolve, reject) {
            if(window.ethereum) {
                window.web3 = new Web3(ethereum); 
                try {
                    ethereum.enable(); 
                } catch (error) {
                    // User denied access 
                }
            }
            resolve(web3)
        })
       
    }
}

export default MetaMask