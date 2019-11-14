pragma solidity ^0.4.14;

contract Organizations {

  struct Organization {
      uint index;
      address owner;
      // array holds all User IDS, input : uint ! 
      address[] memberIndex;
      // this is needed to delete/or retrieve a member out of the array. 
      mapping(address => Member) members;
  }

// Depreceated 
  struct Member {
    // better bool role, role is actually not needed anymore. Condition is only member of Org and 
    bool owner;
    uint index;
  }

  // when adding other Members to an organization
  struct MemberInOrganizations{
    address[] orgIndex;
    mapping(address => uint) organizations;
  }

  // contains a List of all Organizations registered
  address[] organizationIndex; 
  bytes32[] organizationNameIndex;

  mapping(address => Organization) public organizations;
  mapping(bytes32 => uint) organizationNames;

  // userAddresses -> organizations, how many organizations does this user has. 
  mapping(address => MemberInOrganizations) hasOrganizations; 

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
    // TODO: check if msg.sender is a Member of the Organization and has owner Role 
    organizations[organizationAddress].members[memberAddress].owner = role;
    organizations[organizationAddress].memberIndex.push(memberAddress);
    return organizations[organizationAddress].memberIndex.length -1; 
  }

  function createOrganization(address organizationAddress, bytes32 name) public {
      // check if organization has been registered already
      //check if organization name has been taken 
      require(!isOrganisation(organizationAddress));
      require(!organizationNameTaken(name));
      // add organization to the "Organization Registry" 
      organizationNameIndex.push(name);
      organizationIndex.push(organizationAddress);
      organizations[organizationAddress].owner = msg.sender;
      organizations[organizationAddress].index = organizationIndex.length -1; 
      addOrganizationToUser(organizationAddress, msg.sender); 
  }

  function getAddressOfOrganization(bytes32 name) public returns (address orgAddress){
      return organizationIndex[organizationNames[name]]; 
  }

  // this is neccessary for retrieving organizations of a user 
  function addOrganizationToUser(address organization, address user) public {
      hasOrganizations[user].orgIndex.push(organization); 
      hasOrganizations[user].organizations[organization] = hasOrganizations[user].orgIndex.length -1; 
  }

  function getOrganizationsOfUser(address user) public returns (uint count) {
    return hasOrganizations[user].orgIndex.length; 
  }

  function getOrganizationsOfUserByIndex(address user, uint index) public returns (address organizations) {
    return hasOrganizations[user].orgIndex[index];
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
