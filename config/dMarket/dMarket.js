
module.exports = {
    domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" }
    ],
    domainData: {
        name: "Marketplace Registry",               // Name of the domain
        version: "1",                     // Version identifier for this domain
        chainId: 1580457587570,                       // EIP-155 Chain id associated with this domain (1 for mainnet)
        verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',  // Address of smart contract associated with this domain
        salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
    },
    applicationSchema : [
        { name: 'id', type: 'address'},
        { name: 'author' , type: 'address'},  //fest
        { name: 'name', type: 'string'}, // fest 
        { name: 'description', type: 'string'},
        { name: 'downloadLink', type: 'string'},
        { name: 'appReleases', type: 'address[]'}
    ],
    applicationVersionSchema: [
        {name: 'id', type: 'address'},
        {name: 'name', type: 'string'}, 
        {name: 'appID', type: 'address'},
        {name: 'author', type: 'address'},
        {name: 'releaseNote', type: 'string'},
        {name: 'downloadLink', type: 'string'},
        {name: 'supportedApi', type: 'address[]'}
    ],
    apiSchema: [
        
    ],
    apiVersionSchema: [],
    organizationSchema: []
}

