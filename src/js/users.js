import contract from 'truffle-contract'
import UsersContract from '@contracts/Users.json'

const Users = {

  contract: null,

  instance: null,

  account: null,

  init: function () {
    
    return new Promise(function (resolve, reject) {
      Users.contract = contract(UsersContract)
      Users.contract.setProvider(window.web3.currentProvider)

      ethereum.enable()
        .then(function (accounts) {
          console.log(accounts)
          Users.account = accounts[0]
          // You now have an array of accounts!
          // Currently only ever one:
          // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
        })
        .catch(function (error) {
          // Handle error. Likely the user rejected the login
          console.error(error)
        })

      /*   window.web3.eth.accounts().then((accounts) => {
          console.log(accounts)
          Users.account = accounts[0]
        }) */

      Users.contract.deployed().then(instance => {
        Users.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  exists: function (address) {
    
    return new Promise((resolve, reject) => {

      Users.instance.exists.call(
        address || Users.account,
        { from: Users.account }
      ).then(exists => {
        resolve(exists)
      }).catch(err => {
        reject(err)
      })
    })
  },

  authenticate: function () {
    
    return new Promise((resolve, reject) => {
      Users.instance.authenticate.call(
        { from: Users.account }
      ).then(pseudo => {
        resolve(web3.toUtf8(pseudo))
      }).catch(err => {
        reject(err)
      })
    })
  },

  create: function (pseudo) {

    return new Promise((resolve, reject) => {
      Users.instance.create(
        pseudo,
        { from: Users.account.toLowerCase() }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },

  createOrganization: function (pseudo) {

    return new Promise((resolve, reject) => {
      Users.instance.createOrganization(
        pseudo, 
        {from: Users.account.toLowerCase()}
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },

  destroy: function () {
    
    return new Promise((resolve, reject) => {
      Users.instance.destroy(
        { from: Users.account }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default Users
