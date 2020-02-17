import localWeb3 from '../util/localWeb3';
// import DmarketResolver from '../../resolver/dmarket-resolver'
import EthereumClient from '../js/EthereumClient'
import { App, Entity } from './entity'

import dummyApps from './dummyData/dummyApps';

let Resolver;
let userA;
let userB;
let userC;
let userD;
let microsoft;
let apple;
let amazon;
let accounts = [];
let owner;

function stringToBytes32(str) {
    const buffstr =
        '0x' +
        Buffer.from(str)
            .slice(0, 32)
            .toString('hex')
    return buffstr + '0'.repeat(66 - buffstr.length)
}

class Dummy {

    async init() {
        this.web3 = await localWeb3;
        this.ethereumClient = await EthereumClient.getInstance(this.web3);

        let apps = await dummyApps;

        for (let i = 0; i < 3; i++) {
            await this.ethereumClient.registerApp(apps[i]);
        }
    }

    // let user A create several test apps. Have test json in place. 
    async setUpTestData() {

    }

    // create a bunch of Apps. 

}

export default Dummy;

