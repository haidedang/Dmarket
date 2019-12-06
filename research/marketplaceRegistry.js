import contract from 'truffle-contract'
import EthereumDIDRegistry from '@contracts/EthereumDIDRegistry.json'
import ipfs from "@/js/ipfs"


const Registry = {

    contract: {},
  
    instance: null,
  
    account: null,
  
    init: function () {
  
      return new Promise(function (resolve, reject) {

        // Registry.contract.MarketplaceRegistry = contract(MarketplaceRegistry)
       // Registry.contract.MarketplaceRegistry.setProvider(window.web3.currentProvider)

        Registry.contract.EthereumDIDRegistry = contract(EthereumDIDRegistry)
        Registry.contract.EthereumDIDRegistry.setProvider(window.web3.currentProvider)
        
        ethereum.enable()
          .then(function (accounts) {
            console.log(accounts)
            Registry.account = accounts[0]
            // You now have an array of accounts!
            // Currently only ever one:
            // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
          })
          .catch(function (error) {
            // Handle error. Likely the user rejected the login
            console.error(error)
          })
  
        Registry.contract.EthereumDIDRegistry.deployed().then(instance => {
          console.log('EthereumDID Registry deployed')
          Registry.contract.EthereumDIDRegistry.instance = instance
          resolve()
        }).catch(err => {
          reject(err)
        })

        /* Registry.contract.MarketplaceRegistry.deployed().then(instance => {
          console.log('MarketplaceRegistry deployed')
          Registry.contract.EthereumDIDRegistry.instance = instance
          resolve()
        }).catch(err => {
          reject(err)
        }) */
      })
    },
    /* createOrganization: function (address, name) {
  
      return new Promise((resolve, reject) => {
        Organization.instance
        .createOrganization(Organization.account.toLowerCase(), web3.fromAscii(name), { from: Organization.account.toLowerCase() })
        .then(tx => {
          resolve(tx)
        }).catch(err => {
          reject(err)
        })
      })
    }, */
    createOrganization: function (organization) {
        return new Promise((resolve, reject) => {
            // create IPFS Hash of Form Input Data 
            // create new Ethereum Keypair 
            // transfer ownership of EthrDID Account to user address which is creating it 
            // register Application at marketPlaceRegistry 
            // Add marketPlaceRegistry as Signed Delegate 
            // add the IPFS Hash as an Attribute in ETHR DID Registry 
            resolve(ipfs.add(organization))
            
         //   MarketplaceRegistry.instance
            //.setAttribute(MarketplaceRegistry.account.toLowerCase(), web3.utils.fromAscii(name), web3.utils.fromAscii(value), validity, {from: account})
        })
    }
  }
  
  export default Registry
  