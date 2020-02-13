pragma experimental ABIEncoderV2;
pragma solidity ^0.5.12;

import "./EthereumDIDRegistryInterface.sol";
import "./Verifier.sol";
import "./ClaimRegistryInterface.sol";

contract MarketPlaceBase is Verifier{

    EthereumDIDRegistryInterface public registry;
    ClaimRegistryInterface claimRegistry; 

  string public constant TYPE_APP ="app";
  string public constant TYPE_API = "api";
  string public constant TYPE_ORGANIZATION = "organization";
  string public constant TYPE_USER = "user";
  string public constant TYPE_APPVERSION = "appVersion";
  string public constant TYPE_APIVERSION = "apiVersion"; 
  bytes32 public constant DELEGATE_ADMIN = keccak256(bytes("admin"));
  //bytes32 public constant DELEGATE_MEMBER = keccak256(bytes("member"));

  // This holds all organization, app and api IDs registered in the marketplace 
  address[] entityIndex; 

  // This maps the owner of entity to the respective entity. because ownership is transferred to the marketplace, the owner needs to be specified here. The ownership is being transferred, so delegates and other dudes can write to the DECENTRALIZED RESSOURCE RECORDS, or the ERC 1056 data storage. 
  mapping (address => uint) entity; 
  mapping(address => address) EntityOwner; 

  function registerIdentity(address identity, address newOwner) public {
    uint entityID = entityIndex.push(identity) -1;
    entity[identity] = entityID; 
    EntityOwner[identity] = newOwner; 
  }

  function registerEntity(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, address newOwner ) public {
    registry.changeOwnerSigned(identity, sigV, sigR, sigS, address(this));
    uint entityID = entityIndex.push(identity) -1;
    entity[identity] = entityID; 
    EntityOwner[identity] = newOwner; 
  }

  function showOwner(address identity) public view returns(address){
   return registry.identityOwner(identity); 
  }

  /* function registerEntity(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 name, bytes memory value, uint validity, address newOwner) public {
     registry.setAttribute(identity, name, value, validity);
  } */

  function _updateEntity2(address identity, bytes32 name, bytes memory value, uint validity) public {
    // Msg.sender is either the owner of the identity 
    // If he is part of an organization, and he is not an admin he can be a DElegate of the application. But nevertheless he has to be part of the organization. So he still needs to be an admin of the app and be a validDelegate of the company. 
    // require(EntityOwner[identity]== msg.sender || registry.validDelegate(EntityOwner[identity], DELEGATE_ADMIN, msg.sender));
    
    registry.setAttribute(identity, name, value, validity);
  }

  // Ownership is handled in ERC1056
  // Marketplace Logic in here. 
  
  // registers Entity to ERC780 
  function _updateEntity(address identity, address actor,bytes32 key, bytes32 signature) public {
      require( actor == registry.identityOwner(identity) || 
                registry.validDelegate(registry.identityOwner(identity), DELEGATE_ADMIN, actor) ||
                registry.validDelegate(identity, DELEGATE_ADMIN, actor)
              );

      // set the Hash, /app/version 
      claimRegistry.setClaim(identity, key , signature);  
  }

  function getAllEntities() public view returns(uint){
    return entityIndex.length; 
  }

  function getEntity(uint index) public view returns(address){
    return entityIndex[index];
  }

  

  // registers Entity to ERC1056 
/*   function _updateEntityERC1056() public {
      require( actor == registry.identityOwner(identity) || 
                registry.validDelegate(registry.identityOwner(identity), DELEGATE_ADMIN, actor) ||
                registry.validDelegate(identity, DELEGATE_ADMIN, actor)
              );
  } */

  function Test(address identity, bytes32 key) public view returns (bytes32) {
    return claimRegistry.getClaim(address(this), identity, key); 
  }

  function _deleteEntity() internal {

  }

}