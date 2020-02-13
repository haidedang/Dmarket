import Web3 from 'web3'
// import DmarketResolver from '../../resolver/dmarket-resolver'
import EthereumClient from '../js/EthereumClient'
import { App, Entity } from './entity'

const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545')

let Resolver; 
let userA; 
let userB;
let userC;
let userD; 
let microsoft; 
let apple;
let amazon;
let accounts =[];
let owner;

function stringToBytes32 (str) {
    const buffstr =
      '0x' +
      Buffer.from(str)
        .slice(0, 32)
        .toString('hex')
    return buffstr + '0'.repeat(66 - buffstr.length)
}

const dummyApps = [
    {
        appname: 'whatsapp',
        description: 'communication app',
        downloadLink: 'http://whatsapp.com',
        supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'] 
    },
    {
        appName: 'facebook',
        description: 'platform for lovely people',
        downloadLink: 'http://facebook.com',
        supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'] 
    },
    {
        appName: 'spotify',
        description: 'music streaming platform' ,
        downloadLink: 'http://spotify.com',
        supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'] 
    },
    {
        appName: 'slack' ,
        description: 'communication chat bot',
        downloadLink: 'http://slack.com',
        supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'] 
    },
]

class Dummy {

    async init() {
        this.web3 = await new Web3(provider);
        this.ethereumClient  = await EthereumClient.getInstance(this.web3);  
        accounts = await this.web3.eth.getAccounts(); 
       // Resolver = new DmarketResolver(this.web3, this.ethereumClient.registry); 

        userA = accounts[0].toLowerCase();
        userB = accounts[1].toLowerCase();

        for(let i = 0 ; i < 3; i++) {
            dummyApps[i].author = accounts[i]; 
            await this.ethereumClient.registerApp(dummyApps[i]); 
        }

        /* this.apps = [{
            author: accounts[0],
            name: "whatsapp",
            description: "something really cool to message",
            downloadLink: 'http://Server:8080',
        }]
        this.appReleases = [{
            appID: 'did', 
            author: accounts[0],
            name: '1.0', 
            releaseNotes: "",
            downloadLink: 'http://Server:8080/v1'
        }] */
    }

    // let user A create several test apps. Have test json in place. 
    async setUpTestData() {

    }

    // create a bunch of Apps. 

}

export default Dummy; 

