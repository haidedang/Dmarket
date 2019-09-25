pragma solidity ^0.4.14;

contract Users {

  struct User {
    bytes32 name;
    address owner;
    bytes32 IFPSHash;
  }

  struct Organization {
    bytes32 name;
    address owner;
    bytes32 IFPSHash;
  }

  struct Api {
    address owner;
    bytes32 IFPSHash;
  }

  mapping(address => bytes32) public users;
  mapping(address => Organization) public organizations;

  event UserCreated(address indexed _address, bytes32 _pseudo);
  event UserDestroyed(address indexed _address);
  

  function exists (address _address) public constant returns (bool _exists) {
    return (users[_address] != bytes32(0));
  }

  function authenticate () public constant returns (bytes32 _pseudo) {
    require(exists(msg.sender));
    return (users[msg.sender]);
  }

  function create (bytes32 _pseudo) public {
    users[msg.sender] = _pseudo ;
    UserCreated(msg.sender, _pseudo);
  }

  function createOrganization(bytes32 _pseudo) public {
    organizations[msg.sender].name = _pseudo;
    organizations[msg.sender].owner = msg.sender; 
  }
  
  function authenticateOrganization (address _address) public constant returns (bytes32) {
    require(organizations[_address].owner == msg.sender); 
    return (organizations[_address].name); 
  }

  function destroy () public {
    require(exists(msg.sender));
    delete users[msg.sender];
    UserDestroyed(msg.sender);
  }

  function get (address _address) public constant returns(bytes32 _pseudo) {
    require(exists(_address));
    return (users[_address]);
  }

}
