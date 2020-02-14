

const dMarket = require('../../config/dMarket/dMarket'); 
const sha3 = require("js-sha3").keccak_256;
const utils = require('ethereumjs-util');
const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");


function stripHexPrefix(str) {
    if (str.startsWith("0x")) {
      return str.slice(2);
    }
    return str;
}
  
function leftPad(data, size = 64) {
    if (data.length === size) return data;
    return "0".repeat(size - data.length) + data;
}

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

async function signData(identity, registry, key, data) {
    //call nonce of ERC1056 out of marketCore Contract somehow. 
    // TODO: [Issue - #5 Verifiers.js/Nonce]  
    //const nonce = 0; 
    const nonce = await registry.nonce(identity);
    const paddedNonce = leftPad(Buffer.from([nonce], 64).toString("hex"));
    const dataToSign =
        "1900" +
        stripHexPrefix(registry.address) +
        paddedNonce +
        stripHexPrefix(identity) +
        data;
    const hash = Buffer.from(sha3.buffer(Buffer.from(dataToSign, "hex")));
    const signature = utils.ecsign(hash, key);
    const publicKey = utils.ecrecover(
        hash,
        signature.v,
        signature.r,
        signature.s
    );
    return {
        r: "0x" + signature.r.toString("hex"),
        s: "0x" + signature.s.toString("hex"),
        v: signature.v
    };
}

export class Entity {

    constructor (web3){
        let keypair = web3.eth.accounts.create(); 

        let _privateKey = keypair.privateKey.toLowerCase(); 
        this.address = keypair.address;

        this.setPrivateKey = function() {
            _privateKey = keypair.privateKey.toLowerCase();
        }  
        this.getPrivateKey = function() {
            return _privateKey;
        }
    }
    
    // register at the marketplace 
    /**
     * 
     * @param {*} registry ERC1056 instance
     * @param {*} newOwner new Owner Address 
     */
    async setOwnerToMarketplace(registry, newOwner){
        
        let sigObj = await signData(
            this.address,
            registry,
            Buffer.from(
                stripHexPrefix(this.getPrivateKey()),
                "hex"
              ),
            Buffer.from("changeOwner").toString("hex") +
            stripHexPrefix(newOwner)
        );
        
        return sigObj;
    }

    async setIpfsHash(){
        let cid = await ipfs.add(JSON.stringify(this)); 
        this.ipfsHash = cid; 
        return cid; 
    }

    async getData(cid){
        const data = await ipfs.cat(cid);
        return data;
    }

}

export class App extends Entity {
    constructor(web3, {author, appName, description, downloadLink, supportedApp}){
        super(web3);

        this.types = {
            EIP712Domain: dMarket.domain,
            "App": dMarket.applicationSchema
        }
        this.domain = dMarket.domainData,
        this.primaryType = "App",
        this.message = {
            author: author,
            name: appName,
            description: description,
            downloadLink: downloadLink,
            supportedApp: supportedApp
        }; 
    }
}

export class Api extends Entity {

}


/* let organization = new organization()

let api  = new api() 

let appVersion = new appVersion()

let apiVersion = new apiVersion()

const address= '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'


 */

// -----------




