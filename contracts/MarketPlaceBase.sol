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
  bytes32 public constant DELEGATE_MEMBER = keccak256(bytes("member"));


  function registerEntity(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, address newOwner) public {
      registry.changeOwnerSigned(identity, sigV, sigR, sigS, newOwner); 
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
    
    /* uint256 constant chainId = 1573916018149;
    address constant verifyingContract = 0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;
    bytes32 constant salt = 0x77a604b8f7c68ecb34d6df338028f7fad929e2a3c98c72b3a1243f1d4dfac9b1;

    string private constant EIP712_DOMAIN  = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)";

    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));

    bytes32 private constant DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        keccak256("My amazing dApp"),
        keccak256("2"),
        chainId,
        verifyingContract,
        salt
    )); */

}