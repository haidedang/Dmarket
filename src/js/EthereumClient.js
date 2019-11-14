// In the end I have on interface , this file ! 
// MarketPlaceCore. 

// User Profile - make it as simple as possible... 
// I have Organizations and I have my User Profile 

// User Profile -> List all apps that I have.  App name, App Description, Supported APIS, 

// It would be simpler if I have an APP, and I am the owner of the app. 

// Just add Delegates to the app. That's it  actually. Otherwise it is unneccessary complex. 


web3.eth.sign(byte(0x19), byte(0), RegistryAddress, nonce[currentOwner], identity, "changeOwner", newOwner

function signOrder(amount, nonce, callback) {
    var hash = "0x" + ethereumjs.ABI.soliditySHA3(
      ["byte", "byte","address", "uint256", "address", "string","address"],
      [web3.eth.defaultAccount, amount, nonce]
    ).toString("hex");
  
    web3.personal.sign(hash, web3.eth.defaultAccount, callback);
  }

function changeOwner(amount, nonce, callback) {
    var hash = ethereumjs.ABI.soliditySHA3(
      ["byte", "byte","address", "uint256", "address", "string","address"],
      [web3.eth.defaultAccount, amount, nonce]
    ).toString("hex");
  
    web3.personal.sign(hash, privateKey);

  }




  function signPayment(recipient, amount, nonce, contractAddress, callback) {
    var hash = "0x" + ethereumjs.ABI.soliditySHA3(
      ["address", "uint256", "uint256", "address"],
      [recipient, amount, nonce, contractAddress]
    ).toString("hex");
  
    web3.personal.sign(hash, web3.eth.defaultAccount, callback);
  }


  // Builds a prefixed hash to mimic the behavior of eth_sign.
function prefixed(bytes32 hash) internal pure returns (bytes32) {
    return keccak256("\x19Ethereum Signed Message:\n32", hash);
}

function claimPayment(uint256 amount, uint256 nonce, bytes sig) public {
    require(!usedNonces[nonce]);
    usedNonces[nonce] = true;

    // This recreates the message that was signed on the client.
    bytes32 message = prefixed(keccak256(msg.sender, amount, nonce, this));

    require(recoverSigner(message, sig) == owner);

    msg.sender.transfer(amount);
}



function changeOwnerSigned(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, address newOwner) public {
    bytes32 hash = keccak256(byte(0x19), byte(0), this, nonce[identityOwner(identity)], identity, "changeOwner", newOwner);
    changeOwner(identity, checkSignature(identity, sigV, sigR, sigS, hash), newOwner);
  }


  generate the HASHString  

  web3.eth.sign(hash,privateKey)
  sign("","")
  will create a messageHash, and then sign it 
  signature - s r v 


  erecover(hash, signature )
  


  I have to create the same hash on the server side. 



