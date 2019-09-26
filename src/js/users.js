import contract from 'truffle-contract'
import UsersContract from '@contracts/Users.json'
import OrganizationContract from '@contracts/Organizations.json'

const App = {

  contract: {},

  instance: null,

  account: null,

  init: function () {

    return new Promise(function (resolve, reject) {
      App.contract.User = contract(UsersContract)
      App.contract.User.setProvider(window.web3.currentProvider)

      App.contract.Organization = contract(OrganizationContract)
      App.contract.Organization.setProvider(window.web3.currentProvider)

      ethereum.enable()
        .then(function (accounts) {
          console.log(accounts)
          App.account = accounts[0]
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
          App.account = accounts[0]
        }) */

      App.contract.User.deployed().then(instance => {
        console.log('User deployed')
        App.contract.User.instance = instance
      }).catch(err => {
        reject(err)
      })

      App.contract.Organization.deployed().then(instance => {
        console.log('Organization deployed')
        App.contract.Organization.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  createOrganization: function (address, name) {

    return new Promise((resolve, reject) => {
      App.contract.Organization.instance
      .createOrganization(App.account.toLowerCase(), web3.fromAscii(name), { from: App.account.toLowerCase() })
      .then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },


  exists: function (address) {

    return new Promise((resolve, reject) => {

      App.contract.User.instance.exists.call(
        address || App.account,
        { from: App.account }
      ).then(exists => {
        resolve(exists)
      }).catch(err => {
        reject(err)
      })
    })
  },

  authenticate: function () {

    return new Promise((resolve, reject) => {
      App.contract.User.instance.authenticate.call(
        { from: App.account }
      ).then(pseudo => {
        resolve(web3.toUtf8(pseudo))
      }).catch(err => {
        reject(err)
      })
    })
  },

  create: function (pseudo) {

    return new Promise((resolve, reject) => {
      App.contract.User.instance.create(
        pseudo,
        { from: App.account.toLowerCase() }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },

  destroy: function () {

    return new Promise((resolve, reject) => {
      App.contract.User.instance.destroy(
        { from: App.account }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default App
