//imports the IPFS API
import IPFS from '@modules/ipfs-http-client/dist/index.min.js';

/**
 * creates & exports new instance for 
 * IPFS using infura as host, for use.
 */
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfs;

