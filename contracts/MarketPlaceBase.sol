pragma solidity ^0.4.21;


contract MarketPlaceBase {

    EthereumDIDRegistryInterface registry; 

    constructor(address registryAddress){
      registry = EthereumDIDRegistryInterface(registryAddress); 
    }

    event EntityCreated(
        address identity,
        string name,
        string entityType,
        bytes32 timestamp,
        uint validity, 
        uint previousChange
    )

  string public constant TYPE_APP = "app";
  string public constant TYPE_API = "api";
  string public constant TYPE_ORGANIZATION = "organization";
  string public constant TYPE_USER = "user";
  string public constant TYPE_APPVERSION = "appVersion";
  string public constant TYPE_APIVERSION = "apiVersion"; 

  string public constant DELEGATE_ADMIN = "admin" 
  string public constant DELEGATE_MEMBER = "member"

// Entity[] entityIndex; // Why do you need index? If I delete it, index will be different for the ones to come. 
// If I want to update a certain Entity how will I do it. 

// May not be neccessary 
mapping(bytes32=> address) apps;
mapping(bytes32=>address) apis;
mapping(bytes32=> address) organizations; 
mapping(bytes32=> address) users;


mapping(address => uint) changed; 

mapping(address => address) entityOwners; 

// Entity belongs to that address 
// it only maps exactly one value to a key! 
// key must be therefore unique. 

mapping(address => uint) entities;


// Additional Versions , Attributes of the stuff. 
// mapping(address => address) entityOwner; 

mapping(address => address[]) EntityReferenceIndex;
mapping(address => mapping(address=>uint)) referenceID; 

modifier validDelegate (address identity){
  registry.validDelegate(entityOwner(identity), msg.sender, DELEGATE_ADMIN); 
}

function entityOwner(address identity) public returns (address) {
    return entityOwners[identity]; 
}

// signature of the Client, the app private key 
function _addEntity(bytes32 name, bytes signature, address identity, address owner, bytes32 entityType) internal validDelegate {
    
    uint8 v;
    bytes32 r;
    bytes32 s;

    (v,r,s)= splitSignature(sig)

    //interacting with the marketplace requires to delegate owner ship over identities to the smart contract. 
    // But since a smart contract is just decentralized code, the user still owns it! 

   // check if identity belongs to someone 
   // the owner needs to sign the address of the owner and sign it with the private key  and send it to the contract. 
   // user needs to pass the signature, too. -> Different function 
   // Implement the interface like you would 
   // call changeOwner()
   // add Smart Contract as Owner 
   // add User as Owner of App 
   // the msg.sender is not the app address. 
   // if app is not registered yet, then I can use this , but I could then just add another address, but because I m not the owner 
   // I wouldnt be able to set the address of marketplace as owner. 

    //You can just add EVENTS. 
    /* Entity entity = Entity({
        name: name,
        type: entityType,
        owner: owner, 
        timestamp: now
    }) */

    // organization, apps and apis are Marketplace identities. -> ownership to marketplace // Marketplace handles sophisticated access control 


    // proves that owner of address is really the dude. 
    registry.changeOwnerSigned(identity, v, r, s, this); 
    // change Entity Owner 
    entityOwners[identity] = owner; 

    // Just put in the log to save data...
    emit Entity(identity, name, entityType, now, uint(1));

    changed[identity] = block.number;

    //setAttribute(name,type,timestamp)
    //setAttribute(name,type,timestamp)
    // would force me to query blockchain logs. 
    // this is exclusevily for offChain Usage. 
    // what will be 
    // Then I can also just query IPFS Hash.. 
    // name type and timestamp will be needed on chain. and can be queried off Chain. 
    // MERKE: ONLY THE OWNER OF IDENTITY CAN SET ATTRIBUTES AND ADD DELEGATES! 
    
    /* entityID = entityIndex.push(entity) -1; 

    Entities[identity] = entityID;  */
}

//add
_addReference(address identity, address EntityReference) internal validDelegate(){
    // only owner of identity or Delegates of owner 
   referenceID[identity][EntityReference] =  EntityReferenceIndex[identity].push(EntitiyReference) -1; 
}
}