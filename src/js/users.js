import contract from 'truffle-contract'
import UsersContract from '@contracts/Users.json'

const Users = {

  contract: null,

  instance: null,

  account: null,

  init: function () {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract = contract(UsersContract)
      self.contract.setProvider(window.web3.currentProvider)

      ethereum.enable()
        .then(function (accounts) {
          console.log(accounts)
          self.account = accounts[0]
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
          self.account = accounts[0]
        }) */

      self.contract.deployed().then(instance => {
        self.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  exists: function (address) {
    let self = this

    return new Promise((resolve, reject) => {

      self.instance.exists.call(
        address || self.account,
        { from: self.account }
      ).then(exists => {
        resolve(exists)
      }).catch(err => {
        reject(err)
      })
    })
  },

  authenticate: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.authenticate.call(
        { from: self.account }
      ).then(pseudo => {
        resolve(web3.toUtf8(pseudo))
      }).catch(err => {
        reject(err)
      })
    })
  },

  create: function (pseudo) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.create(
        pseudo,
        { from: self.account.toLowerCase() }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },

  destroy: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.destroy(
        { from: self.account }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default Users
