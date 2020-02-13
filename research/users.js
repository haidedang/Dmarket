import contract from 'truffle-contract'
import UsersContract from '@contracts/Users.json'


const User = {

  contract: {},

  instance: null,

  account: null,

  init: function () {

    return new Promise(function (resolve, reject) {
      User.contract = contract(UsersContract)
      User.contract.setProvider(window.web3.currentProvider)

      ethereum.enable()
        .then(function (accounts) {
          console.log(accounts)
          User.account = accounts[0]
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
          User.account = accounts[0]
        }) */

      User.contract.deployed().then(instance => {
        console.log('User deployed')
        User.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      })

      /* User.contract.Organization.deployed().then(instance => {
        console.log('Organization deployed')
        User.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      }) */
    })
  },
  exists: function (address) {

    return new Promise((resolve, reject) => {

      User.instance.exists.call(
        address || User.account,
        { from: User.account }
      ).then(exists => {
        resolve(exists)
      }).catch(err => {
        reject(err)
      })
    })
  },

  authenticate: function () {

    return new Promise((resolve, reject) => {
      User.instance.authenticate.call(
        { from: User.account }
      ).then(pseudo => {
        resolve(web3.toUtf8(pseudo))
      }).catch(err => {
        reject(err)
      })
    })
  },

  create: function (pseudo) {

    return new Promise((resolve, reject) => {
      User.instance.create(
        pseudo,
        { from: User.account.toLowerCase() }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },

  destroy: function () {

    return new Promise((resolve, reject) => {
      User.instance.destroy(
        { from: User.account }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default User