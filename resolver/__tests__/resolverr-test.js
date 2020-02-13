import EthereumClient from '../../src/js/EthereumClient'
/* import Web3 from 'web3'
const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545')
 */

const Web3 = require('web3'); 
var provider = new Web3.providers.HttpProvider("http://localhost:8545");

import {Resolver} from 'did-resolver';
import ethr from 'ethr-did-resolver';
import {stringToBytes32} from '../dmarket-resolver'

let instance
let accounts
let resolver
let didResolver
let identity
let owner
let delegate1
let delegate2
let did

describe('Resolver', () => {

    beforeAll(async() => {
        let web3 = await new Web3(provider);
        instance  = await EthereumClient.getInstance(web3); 
        accounts = await instance.web3.eth.getAccounts(); 
        identity = accounts[1].toLowerCase()
        owner = accounts[2].toLowerCase()
        delegate1 = accounts[3].toLowerCase()
        delegate2 = accounts[4].toLowerCase()
        did = `did:ethr:${identity}`

        resolver = ethr.getResolver({web3: instance.web3, registry: instance.registry.address});
        console.log(resolver)
        didResolver = new Resolver(resolver)
    })
    
    describe('resolver', () => {
        it('should resolve accordingly', async () => {
            let doc = await didResolver.resolve('did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74')
            console.log(doc)
        })
    })
    
    describe('owner changed', () => {
        beforeAll(async () => {
          await instance.registry.changeOwner(identity, owner, { from: identity })
        })
    
        it('resolves document', () => {
          console.log(did)
          return expect(didResolver.resolve(did)).resolves.toEqual({
            '@context': 'https://w3id.org/did/v1',
            id: did,
            publicKey: [
              {
                id: `${did}#owner`,
                type: 'Secp256k1VerificationKey2018',
                owner: did,
                ethereumAddress: owner
              }
            ],
            authentication: [
              {
                type: 'Secp256k1SignatureAuthentication2018',
                publicKey: `${did}#owner`
              }
            ]
          })
        })
        
    })

    describe('attributes', () => {
        describe('add IPFS hash', () => {
            describe('IPFS hash', () => {
              
                // set the IPFS Hash 
                beforeAll(async () => {
                    await instance.registry.setAttribute(
                        owner,
                        stringToBytes32('did/dMarket/metaData'),
                        'IPFS2',
                        20000,
                        { from: owner }
                    )
                })

                it('resolves document', async () => {
                    let doc = await didResolver.resolve(did); 
                    console.log(doc)

                    // DmarketResolver.resolve(did) 

                    // This right now just tests the ethr did resolver. 
                    //  I need to test the Dmarket resolver. 

                    /* return expect(didResolver.resolve(did)).resolves.toEqual({
                    '@context': 'https://w3id.org/did/v1',
                    id: did,
                    publicKey: [
                        {
                        id: `${did}#owner`,
                        type: 'Secp256k1VerificationKey2018',
                        owner: did,
                        ethereumAddress: owner
                        }        
                    ],
                    authentication: [
                        {
                        type: 'Secp256k1SignatureAuthentication2018',
                        publicKey: `${did}#owner`
                        },
                        {
                        type: 'Secp256k1SignatureAuthentication2018',
                        publicKey: `${did}#delegate-1`
                        }
                    ],
                    service: [
                        {
                        type: 'HubService',
                        serviceEndpoint: 'https://hubs.uport.me'
                        }
                    ]
                    }) */
                })
            })
          })
    })

    /* describe('attributes', () => {
        describe('add IPFS Hash with Marketplace Meta Data', () => {
            describe('DMarket', () => {
                beforeAll(async () => {
                        await registry.setAttribute(
                        identity,
                        stringToBytes32('did/svc/HubService'),
                        'https://hubs.uport.me',
                        10,
                        { from: owner }
                    )
                })
                it('resolves document', () => {
                    return expect(didResolver.resolve(did)).resolves.toEqual({
                        '@context': 'https://w3id.org/did/v1',
                        id: did,
                        'publicKey': [{
                            'id': 'did:uport:2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX#keys-1',
                            'type': 'Secp256k1VerificationKey2018',
                            'owner': 'did:uport:2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX',
                            'publicKeyHex': '04613bb3a4874d27032618f020614c21cbe4c4e4781687525f6674089f9bd3d6c7f6eb13569053d31715a3ba32e0b791b97922af6387f087d6b5548c06944ab062'
                        }],
                        'DmarketProfile': {
                            '@context': 'http://schema.org',
                            '@type': 'Organization',
                            'name': 'uPort @ Devcon 3',
                            'description': 'Uport Attestations',
                            'image': {'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': '/ipfs/QmSCnmXC91Arz2gj934Ce4DeR7d9fULWRepjzGMX6SSazB'}
                        },
                        'authentication': [{
                            'type': 'Secp256k1SignatureAuthentication2018',
                            'publicKey': 'did:uport:2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX#keys-1'
                        }]
                    })
                })
            })
        })
    }) */

    

})



// use ethr DID REsolver 

// Ethr DID Resolve -> Get IPFS Hash   CHECK 

// fetch IPFS Hash  -> get JSON object   // functionality is already written 
// LTD -> fetch it from the blockchain and parse it back correctly 

// convertToDid -> append the JSON object to DID Document 

// => YOU ARE FUCKING DONE




// Critique  -> It takes the Ethereum Client, but this client is bounded by the contracts which needs to be deployed first. 

// If I want to run tests it should initiate the blockchain in a blank state. 


