import {Resolver} from 'did-resolver';
// IMPORTANT: Modified Ethr DID Module Version !! 
import ethr from 'ethr-did-resolver';


const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");

export function stringToBytes32 (str) {
    const buffstr =
      '0x' +
      Buffer.from(str)
        .slice(0, 32)
        .toString('hex')
    return buffstr + '0'.repeat(66 - buffstr.length)
}

export function stringToBytes(str) {
    // convert String into a Buffer and turn that Buffer into a string. Buffer is already in hex 
    let myBuffer ='0x' + Buffer.from(str).toString('hex')
    return myBuffer; 
}

export function bytesToString (bufferData) {
    bufferData = bufferData.substring(2); 
    // Turn it into Buffer node and convert it back to the UTF 8 String. 
    let buf = Buffer.from(bufferData, 'hex').toString('utf8'); 
   return  buf
}

export function bytes32toString (bytes32) {
    return Buffer.from(bytes32.slice(2), 'hex')
      .toString('utf8')
      .replace(/\0+$/, '')
  }

export class DmarketResolver {

    /**
     * 
     * @param {web3} web3  web3 Instance 
     * @param {Contract} registry Registry deployed Contract Instance 
     */
    constructor(web3, registry){
        let resolver = ethr.getResolver({web3: web3, registry: registry.address});
        let didResolver = new Resolver(resolver); 
        this.didResolver = didResolver
    }

    /**
     * 
     * @param {string} did 
     */
    async resolve(did) { 
      let didObject  =  await this.didResolver.resolve(did);
      let doc = didObject;
     
      if (doc.dMarket) {
        for(let i = 0 ; i< doc.dMarket.length; i++){
          if (doc.dMarket[i].type == 'profileData'){
            let result = await ipfs.cat(doc.dMarket[i].data)
            doc.dMarket= JSON.parse(result)
          }
        }
        // fetch IPFS 
        /* let result = await ipfs.cat(cid);
        const profile = Object.assign({}, doc.result); 
        doc.dmarketProfile = profile  */
      }

    return doc;
    }
}


