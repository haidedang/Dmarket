pragma solidity ^0.4.14;

contract Organizations {

  struct Organization {
      uint index;
      address owner;
      address[] memberIndex;
      mapping(address => Member) members;
  }

  struct Member {
    bool owner;
    uint index;
  }

  // contains a List of all Organizations registered
  address[] organizationIndex; 
  bytes32[] organizationNameIndex;

  mapping(address => Organization) public organizations;
  mapping(bytes32 => uint) organizationNames;

  event UserCreated(address indexed _address, bytes32 _pseudo);
  event UserDestroyed(address indexed _address);

  // check if Organization has been registered already 
  function isOrganisation(address organizationAddress) public constant returns (bool isIndeed){
      if(organizationIndex.length == 0) return false;
      //check if registered address stimmt überein
      return(organizationIndex[organizations[organizationAddress].index] == organizationAddress);  
  }

  // check if name is taken already 
  function organizationNameTaken(bytes32 name) public constant returns (bool isTaken){
      return organizationNames[name] > 0;
  }

  function addMember(address organizationAddress, address memberAddress, bool role) public returns (uint index){
    organizations[organizationAddress].members[memberAddress].owner = role;
    organizations[organizationAddress].memberIndex.push(memberAddress);
    return organizations[organizationAddress].memberIndex.length -1; 
  }

  function createOrganization(address organizationAddress, bytes32 name) public {
      // check if organization has been registered already
      //check if organization name has been taken 
      require(!isOrganisation(organizationAddress));
      require(!organizationNameTaken(name));
      organizationNameIndex.push(name);
      organizationIndex.push(organizationAddress);
      organizations[organizationAddress].owner = msg.sender;
      organizations[organizationAddress].index = organizationIndex.length -1; 
      return true;
  }

  function getAddressOfOrganization(bytes32 name) public returns (address orgAddress){
      return organizationIndex[organizationNames[name]]; 
  }



/* 
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
 */
}
