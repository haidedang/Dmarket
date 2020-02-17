import localWeb3 from '../../util/localWeb3';

// This is what is created on the client. Hypothetically I could now fake owner and author. 
// This is where verifying the data comes in. 
// I could now verify that app because this app will get signed. 
// if I query the app ID from the blockchain, I should get an IPFS Hash. And resolving this should return my this app document.
// I could also take that IPFS object and verify with the smart contract. 
// I will tell me, wether the one who uploaded that document really put in 
// the right owner and the right author. 
// The author is the one who signs it, The owner is the one , who owns it. 

// In the ERC1056 though there is only the owner. How can I determine the author. 
// The author has to be a valid Delegate of the owner. This is all that matters. 
// If he is member, then how to do it.. 

// the one who registers the app in the organization smart contract is the author! 


// what they do is really registering the app to an organization. 
// If I assign the application to an anoother key, this key could be a smart contract. 
// This smart contract is the organization account. 

// This smart contract just handles who can write to the decentralized app records. 

// The data is been drawn from the DID. How to make other people being able to write to that application to. 

// rudimentary access control. 

// ERC 1056 ownership change. 


let apps = localWeb3.then((web3) => {
    return web3.eth.getAccounts().then(accounts => {
        return [
            {   
                owner: accounts[0],
                author: accounts[1],
                name: 'whatsapp',
                description: 'communication app',
                downloadLink: 'http://whatsapp.com',
                appReleases: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
            },
            {   
                owner: accounts[0],
                author: accounts[2],
                name: 'facebook',
                description: 'platform for lovely people',
                downloadLink: 'http://facebook.com',
                appReleases: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
            },
            {
                owner: accounts[0],
                author: accounts[3],
                name: 'spotify',
                description: 'music streaming platform',
                downloadLink: 'http://spotify.com',
                appReleases: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
            },
            {
                owner: accounts[0],
                author: accounts[4],
                name: 'slack',
                description: 'communication chat bot',
                downloadLink: 'http://slack.com',
                appReleases: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
            },
        ]
    });
})

export default apps; 