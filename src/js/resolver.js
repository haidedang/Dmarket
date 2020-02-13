import resolve from 'did-resolver'
import register, { stringToBytes32, delegateTypes } from '../register'
import Contract from 'truffle-contract'
import DidRegistryContract from 'ethr-did-registry'
import Web3 from 'web3'
import ganache from 'ganache-cli'

function sleep(seconds) {
  return new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000))
}

export function bytes32toString(bytes32) {
    return Buffer.from(bytes32.slice(2), 'hex')
      .toString('utf8')
      .replace(/\0+$/, '')
  }
  
export function stringToBytes32(str) {
    const buffstr =
      '0x' +
      Buffer.from(str)
        .slice(0, 32)
        .toString('hex')
    return buffstr + '0'.repeat(66 - buffstr.length)
  }
  
export const delegateTypes = {
    Secp256k1SignatureAuthentication2018: stringToBytes32('sigAuth'),
    Secp256k1VerificationKey2018: stringToBytes32('veriKey'),
  }

export const attrTypes = {
    sigAuth: 'SignatureAuthentication2018',
    veriKey: 'VerificationKey2018',
  }

  