/* import contract from 'truffle-contract'
import OrganizationContract from '@contracts/Organizations.json'

const Organization = {

    contract: {},
  
    instance: null,
  
    account: null,
  
    init: function () {
  
      return new Promise(function (resolve, reject) {
        Organization.contract = contract(OrganizationContract)
        Organization.contract.setProvider(window.web3.currentProvider)
        console.log(Organization.contract)
  
        ethereum.enable()
          .then(function (accounts) {
            console.log(accounts)
            Organization.account = accounts[0]
            // You now have an array of accounts!
            // Currently only ever one:
            // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
          })
          .catch(function (error) {
            // Handle error. Likely the user rejected the login
            console.error(error)
          })
  
        Organization.contract.deployed().then(instance => {
          console.log('Organization deployed')
          Organization.instance = instance
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    createOrganization: function (address, name) {
  
      return new Promise((resolve, reject) => {
        Organization.instance
        .createOrganization(Organization.account.toLowerCase(), web3.fromAscii(name), { from: Organization.account.toLowerCase() })
        .then(tx => {
          resolve(tx)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOrganizationsOfUser: function (userAddress) {

        return new Promise((resolve, reject) => {
    
          Organization.instance.getOrganizationsOfUser.call(
            userAddress || Organization.account,
            { from: Organization.account }
          ).then(exists => {
            resolve(exists)
          }).catch(err => {
            reject(err)
          })
        })
      },
    signMessage: function() {
      console.log('message')
      console.log(web3.eth.accounts.sign("hey", "0x8a87ddc9d4f26d495636bd8c8e0b325d6e81095f8e97cfd09c646890d1d4e6ff"))
    }
  }
  
  export default Organization
   */