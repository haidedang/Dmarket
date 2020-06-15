# Dmarket

The goal of this project is to create a decentralized marketplace where users can buy and sell their apps.

## Getting Started

### Prerequisites

1.  [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
2.  [NodeJS + NPM](https://nodejs.org/en/download/package-manager/) Node v10.15.1
3.  Truffle v5.0.27 (core: 5.0.27)

```
npm install -g truffle@4.1.11
```

### Installation

Run local blockchain with the same accounts always 

```
ganache-cli -d
```

Install required dependencies

```
npm install
```

Install & Start MongoDB (macOS)

```
brew install mongodb
sudo mongod
```

Run development build

```
npm start
```

Run production build

```
npm run bs
```

Run local blockchain

```
truffle develop
```

Deploy smart contracts on local blockchain

```
truffle migrate
```

Run application in browser

```
npm run start
```

## Running the tests

Run tests

```
npm run test
```

Test specific smart contracts
```
cd test/truffle 
truffle test fileName.js 
```

```
\begin{verbatim}
├── src (Blade Frontend)
│   ├── components (groups of related components)
│   │   ├── Appstore
│   │   │   ├──── Entity (component, pages, ...)
│   │   │   ├──── Organization (components, pages, ...)
│   ├── util
│   ├── App.js (root component)
│   ├── index.js (injects root component into page)
│   ├── main.css
│   ├── reducers.js (root redux reducer)
│   ├── routes.js
│   └── store.js (state of app)
|
├── contract (Ethereum smart contracts)
|
├── dist (producton build for deployment)
|
├── Intl (text for client)
|
├── server (registry server)
│   ├── controllers (communication with blockchain)
│   │   ├── trade.controller.js
│   │   └── car.controller.js
│   ├── models
│   │   ├── Api.js 
│   │   ├── ApiRelease.js 
│   │   ├── App.js 
│   │   ├── AppRelease.js    
│   │   └── Organization.js
│   ├── routes
│   │   ├── app.routes.js (fetch marketplace entities ...)
│   │   ├── car.routes.js (find, details, ...)
│   ├── util
│   │   ├── config.js
│   │   ├── dMarketService.js
│   └── server.js (setup, db connection, startup, ...)
|
├── node_modules
├── README.md
├── package.json
└── .gitignore

```





## Built With

* [Truffle](http://truffleframework.com/)
* [Solidity](https://solidity.readthedocs.io/en/v0.4.23/)
* [OpenZeppelin](https://openzeppelin.org/)
* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](http://expressjs.com/de/)
* [VueJS](https://reactjs.org)
* [Webpack](https://webpack.js.org)
* [MongoDB](https://www.mongodb.com)


