pragma experimental ABIEncoderV2;
pragma solidity ^0.5.12;

import "./AccessControl.sol";
import "./MarketPlaceBase.sol";

contract MarketPlaceCore is AccessControl, MarketplaceBase {

  constructor(address _ethereumDIDRegistry, address _claimRegistry) public {
      registry = EthereumDIDRegistryInterface(_ethereumDIDRegistry); 
      claimRegistry = ClaimRegistryInterface(_claimRegistry);
  }

}