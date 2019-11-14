// only registered Users right? 
_addApp (bytes32 owner, address appAddress, bytes32 appName) internal onlyValidUser {
    //Create APP 
    Entity memory entity = Entity({
        name : appName,
        type : TYPE_APP,
        timestamp: now
        owner: owner 
        // sender will always be a person. 
        // Owner is User, organization though has to add Members. 
        // If he is member he will be able to add it nevertheless. 
        // If organization deletes him, he still is able to access it. 
        // If he has the private key, he will always be able to edit this in fact. 
        // marketplace registry needs to be the controlling instance on that one. 
        // Set the owner as Marketplace. 
        // changeOwnerShip -> only Delegate Of Organization. 

        // Identity   and marketplace specific Identities... 
        // User identities will be there. But different functions for apps apis and organizations. 
        // 
    })

    // Add entity 
    entities[owner] = entityIndex.push(entity) - 1;

    // Register name 
    apps[appName] = appAddress; 

     // set Marketplace Registry as a signed Delegate , inherited, will call the parent function ... 
    addDelegate(appAddress, address(this));

    /// @dev TODO:   emit Event AppCreated 
}

/// @dev User who wants to register an app. 
/// 
addApp(address owner, address appAddress, bytes32 appName, bytes32 IPFSHash, struct AppStruct) public { 
    /// --- ACCESS CONTROL---- 
    //Checks if msg.sender is a valid Delegate.  
    //require(Registry.validDelegate(appAddress, keccak("member"), msg.sender))

    /// 
    verify(AppStruct)

    // check for AppName availability
    require(apps[appName] == 0)

    // add App to Registry 
    _addApp(owner, appAddress, appName); 

}

addMember(){
    Registry.addDelegateSigned(address identity, address actor); 
    // organization is the owner. Addresses which are Delegates, will act as the owner. can edit 
    // the app addresses, where the owner is the organization. 
    // if organization revokes him, he cannot edit anymore. since only owner can do that stuff. 
}

editApp(address identity, address actor){ 
    // 
    require(validDelegate(identity, actor))
    
    //Only Delegates of Identity can edit apps.   
    Registry.setAttributeDelegateSigned(identity, address(this)) 
    Registry.setAttributeDelegateSigned(API Address, address(this))
}


Client save private key of App signs Pk User -> signature 

actor is App A .. 

But I want the newOwner to pay it. 



_changeOwner(address identity, address actor, address newOwner)  {
//is the msg.sender holder of the identity address. How can I use a private key while using funds of another one
// I would have to send fund from User A to app Key A so he can make the transaction. 
// user would have to log in meta mask with the new account. 
// 

// Just have that freaking App  in your contract and set owner to the address. 

// I cannot set Attributes unless I require that fukkin transaction. 

    verify (signature) => returns pk 
    // I know that private Key signed that User A . 
    require(pk == identity) 
    owners[identity] = newOwner
}


modifier onlyOwner(address identity, address actor) {
    // actor is holder of the private key OR owner of the app 
    require (actor == identityOwner(identity));
    _;
  }

function identityOwner(address identity) public view returns(address) {
     address owner = entities[address].owner;

     // if registered to another address return this 
     // Specify , where ownership of Ethereum Address will be stored. 
     // Either in the mapping owner. Or in the struct. 
     // Each address is an identity already. If you create a new app address, You are using it only as an
     // decentralized Identifier so to say. So you can build the DID Documents and append those attributes. 
     // the mapping is therefore valid.. easy way would be doing it like so. 

     // I have two kinds of identityOwner. The 
    
    // If there is a different owner then just return the owner right away. 
    // If not then check for entity owner. If he exists then return him,

    // this requires User registration. but it still uses DID. 
         if(owner != 0x0){
             return owner;
         }
         return identity;
}

function changeOwner(address identity, address actor, address newOwner) internal onlyOwner(identity, actor) {
   // will map  addressIdentity => newOwnerAddress , in fact here it will be specified in the contract for the first time. 
   // This is only done, so that those addresses can act in behalf of the other addresses! 
    owners[identity] = newOwner;

    entityIndex[entities[identity]].owner = newOwner; 
    emit DIDOwnerChanged(identity, newOwner, changed[identity]);
    changed[identity] = block.number;
}

function changeOwner(address identity, address newOwner) public { 
    __changeOwner(address identity, msg.sender, address newOwner) 
}

createApp(){
    Registry.changeOwner(appAddress, this); 
}


// add Delegate -> this address will act as the owner. 




