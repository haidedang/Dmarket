
pragma solidity ^0.5.12;

contract ERC721Extended {
  // Required methods
  function totalSupply() public view returns (uint256 total);

  function balanceOf(address _owner) public view returns (uint256 balance);

  function ownerOf(uint256 _tokenId) public view returns (address owner);

  function approve(address _to, uint256 _tokenId) public;

  function transfer(address _to, uint256 _tokenId) external;

  function transferFrom(address _from, address _to, uint256 _tokenId) public;

  // Events
  event Transfer(address from, address to, uint256 tokenId);
  event Approval(address owner, address approved, uint256 tokenId);

  // Optional
  // function name() public view returns (string name);
  // function symbol() public view returns (string symbol);
  // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
  // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

  // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
  function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}
