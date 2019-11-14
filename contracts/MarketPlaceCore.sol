contract MarketPlaceCore is MarketPlaceBase{

constructor(address _ethereumDIDRegistry) public {
        ethereumDIDRegistry = EthereumDIDRegistryInterface(_ethereumDIDRegistry); 
  }

// ---------MarketplaceCORE -------------
// Core Contract to interact with 

registerUser(bytes32 name) onlyValidUser{
    // Username Validity 
    require(users[name] == 0x0)
    //You actually don't need this. 
    _addEntity(name, msg.sender, msg.sender, TYPE_USER); 
}

registerOrganization(bytes32 name, address organization){
    // This will prove that msg.sender has organization key. 

    _addEntity(name, organization, msg.sender, TYPE_ORGANIZATION); 
    //TODO 
    addDelegate(this)
}

addMemberToOrganization(bytes32 username, address organization, uint validity){
    require(identityOwner(organization) == msg.sender || validDelegate(organization, msg.sender))
    // No need? 
    // _addReference(organization, users[username]);
    addDelegate(organization, users[username], "Developer", validity);
}

// Either owner = user , or Owner = organization , owner or ValidDelegate 
// App belongs to Organization. so not delegate of the app but of the organization should be able to edit it, 
// validDelegates of the owner of app address should be able to edit it 
registerApp(bytes32 name, address app, bytes signature, address owner, bytes data){
    // check if name is already taken 
    require(apps[name] == 0x0)

    // make sure that the user has the private key of that app. 
    //verify that STRUCT is conforming to the Marketplace Structure, but in fact you dont need this validity. 
    // it is just the meta data. 
    // description, Pictures. 
    // This is important 
    // this requires appSignature already! That is good. 

    // cannot claim ownership of another app. 
    _addEntity(name, app, TYPE_APP); 

    (address identity, bytes32 name, bytes value, uint validity)
    Registry.setAttribute(app, name, "MetaData", IPFSHash, 10);
}

registerAppRelease(bytes32 versionName, address owner, address appversion, bytes32 IPFSHASH){
    //
    _addEntity(versionName, appversion, owner, TYPE_VERSION); 
    // add supported APIs 
    _addReference(appversion, apiversion)
    // add Versions to the App // expensive 
    //_addReference(apiversion, appversion)
    setAttribute
    setAttributeSigned(appversion, this, "MetaData", IPFSHash); 
}

editAppRelease(address version){
    require(validDelegate(version.ownerAddress,msg.sender) || msg.sender ==identityOwner(appVersion))
    setAttributeSigned(appversion,this,"data",IPFSHash)
}

deleteAppRelease(){

}


// ALL THIS WILL BE HANDLED BY FRONTEND 

//querying  OPtion A -> Onchain. 
// Option B -> Events, app Identity return owner 

getApps() public view returns (address[] memory){
    address[] result; 
    for(int i = 0; i< entityIndex.length; i++){
        if(entityIndex[i].type == TYPE_APP){
            result.push(entityIndex[i]); 
        }
    }
    return result
}



// get all apps by userName .. is this more expensive? Contract deployment is expensive only right? 
// This shit is free so get it. 
getAppsOfUserID(bytes32 username) public view returns (address[] memory){
    // Find all apps where owner is user 

    address[] result;
    for(int i = 0; i< entityIndex.length; i++){
        if(entityIndex[i].owner == users[username]){
            result.push(entityIndex[i].name); 
        }
    }
    return result; 
    // Find all apps, where owner is userName. 
}

getVersionsOfAppID(bytes32 appName) public view returns (address[] memory){
    address[] versions;
   for(i=0;i< EntityReferenceIndex[apps[appName]].length, i++ ){
       versions.push(EntityReferenceIndex[apps[appName]][i]);
   }
   return versions; 
}

getVersion(address version) public returns (Entity){
    return entityIndex[entities[version]]
}

//
getAPIsByAppID(address App) public returns (){

}

//
getAllAppsToApis(){

}


}

// To CHECK : returning an Entity? 
// returning an array? 
// verifiable Claims. 
// query the Delegates of this organization where userID matches. 
