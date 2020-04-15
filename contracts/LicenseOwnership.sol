pragma solidity ^0.5.12;

import "./LicenseBase.sol";
import "./ERC721Extended.sol";

contract LicenseOwnership is ERC721Extended, LicenseBase {
    bytes4 constant InterfaceSignature_ERC165 = bytes4(
        keccak256("supportsInterface(bytes4)")
    );

    bytes4 constant InterfaceSignature_ERC721 = bytes4(keccak256("name()")) ^
        bytes4(keccak256("symbol()")) ^
        bytes4(keccak256("totalSupply()")) ^
        bytes4(keccak256("balanceOf(address)")) ^
        bytes4(keccak256("ownerOf(uint256)")) ^
        bytes4(keccak256("approve(address,uint256)")) ^
        bytes4(keccak256("transfer(address,uint256)")) ^
        bytes4(keccak256("transferFrom(address,address,uint256)")) ^
        bytes4(keccak256("tokensOfOwner(address)")) ^
        bytes4(keccak256("tokenMetadata(uint256,string)"));

    /// @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
    ///  Returns true for any standardized interfaces implemented by this contract. We implement
    ///  ERC-165 (obviously!) and ERC-721.
    function supportsInterface(bytes4 _interfaceID)
        external
        view
        returns (bool)
    {
        return ((_interfaceID == InterfaceSignature_ERC165) ||
            (_interfaceID == InterfaceSignature_ERC721));
    }

    // Total amount of tokens
    uint256 private totalTokens;

    // Mapping from token ID to owner
  mapping(uint256 => address) private tokenOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
  //  Used internally inside balanceOf() to resolve ownership count.
  mapping(address => uint256) ownershipTokenCount;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private tokenApprovals;

    /// @dev Checks if a given address is the current owner of a particular license.
  /// @param _claimant the address to validate.
  /// @param _tokenId license id, must be > 0
  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return tokenOwner[_tokenId] == _claimant;
  }

   /// @dev Checks if a given address currently has transferApproval for a particular license.
  /// @param _claimant the address to validate.
  /// @param _tokenId license id, must be > 0
  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return tokenOwner[_tokenId] == _claimant;
  }

    /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
  ///  approval. Setting _approved to address(0) clears all transfer approval.
  function _approve(uint256 _tokenId, address _approved) internal {
    tokenOwner[_tokenId] = _approved;
  }

   /// @notice Returns the number of licenses owned by a specific address.
  /// @param _owner The owner address to check.
  /// @dev Required for ERC-721 compliance
  function balanceOf(address _owner) public view returns (uint256 count) {
    return ownershipTokenCount[_owner];
  }

  /// @notice Transfers a license to another address.
  /// @param _to The address of the recipient, can be an user or contract.
  /// @param _tokenId The ID of the license to transfer.
  /// @dev Required for ERC-721 compliance.
  function transfer(
    address _to,
    uint256 _tokenId
  )
  external
  {
    // Safety check to prevent against an unexpected 0x0 default.
    require(_to != address(0));
    require(_to != address(this));
    require(_owns(msg.sender, _tokenId));
    require(_isValidLicense(_tokenId));

    // Reassign ownership, clear pending approvals, emit Transfer event.
    _transfer(msg.sender, _to, _tokenId);
  }

  /// @notice Grant another address the right to transfer a specific license via
  ///  transferFrom(). This is the preferred flow for transferring NFTs to contracts.
  /// @param _to The address to be granted transfer approval. Pass address(0) to
  ///  clear all approvals.
  /// @param _tokenId The ID of the license that can be transferred if this call succeeds.
  /// @dev Required for ERC-721 compliance.
  function approve(
    address _to,
    uint256 _tokenId
  )
  public
  {
    // Only an owner can grant transfer approval.
    require(_owns(msg.sender, _tokenId));

    // Register the approval (replacing any previous approval).
    _approve(_tokenId, _to);

    // Emit approval event.
    emit Approval(msg.sender, _to, _tokenId);
  }

  /// @notice Transfer a license owned by another address, for which the calling address
  ///  has previously been granted transfer approval by the owner.
  /// @param _from The address that owns the license to be transferred.
  /// @param _to The address that should take ownership of the license. Can be any address,
  ///  including the caller.
  /// @param _tokenId The ID of the license to be transferred.
  /// @dev Required for ERC-721 compliance.
  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
  public
  {
    // Safety check to prevent against an unexpected 0x0 default.
    require(_to != address(0));
    // Disallow transfers to this contract to prevent accidental misuse.
    // The contract should never own any licenses
    require(_to != address(this));
    // Check for approval and valid ownership
    require(_approvedFor(msg.sender, _tokenId));
    require(_owns(_from, _tokenId));

    // Reassign ownership (also clears pending approvals and emits Transfer event).
    _transfer(_from, _to, _tokenId);
  }

    /**
  * @notice Gets the owner of the specified token ID
  * @param _tokenId uint256 ID of the token to query the owner of
  * @return owner address currently marked as the owner of the given token ID
  */
    function ownerOf(uint256 _tokenId) public view returns (address) {
        address owner = tokenOwner[_tokenId];
        require(owner != address(0));
        return owner;
    }

    /**
  * @notice Gets the total amount of tokens stored by the contract
  * @return uint256 representing the total amount of tokens
  */
    function totalSupply() public view returns (uint256) {
        return licenses.length;
    }


  /// @notice Returns a list of all license IDs assigned to an address.
  /// @param _owner The owner whose licenses we are interested in.
  /// @dev This should not be called by contract code since it's expensive
  function tokensOfOwner(address _owner) external view returns (uint256[] memory ownerTokens) {
    uint256 tokenCount = balanceOf(_owner);

    if (tokenCount == 0) {
      // Return an empty array
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](tokenCount);
      uint256 totalLicenses = totalSupply();
      uint256 resultIndex = 0;

      // We count on the fact that all licenses have IDs starting at 1 and increasing
      // sequentially up to the totallicense count.
      uint256 licenseId;

      for (licenseId = 1; licenseId <= totalLicenses; licenseId++) {
        if (tokenOwner[licenseId] == _owner) {
          result[resultIndex] = licenseId;
          resultIndex++;
        }
      }

      return result;
    }
  }

/// @dev Assigns ownership of a specific license to an address.
  function _transfer(address _from, address _to, uint256 _licenseId) internal {
    // update token count
    ownershipTokenCount[_to]++;
    // transfer ownership
    tokenOwner[_licenseId] = _to;
    // When creating new licenses _from is 0x0, but we can't account that address.
    if (_from != address(0)) {
      ownershipTokenCount[_from]--;
      // remove transfer approval
      delete tokenApprovals[_licenseId];
    }
    // Emit the transfer event.
    emit Transfer(_from, _to, _licenseId);
  }
}








