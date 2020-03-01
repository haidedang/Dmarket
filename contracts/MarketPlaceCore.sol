pragma experimental ABIEncoderV2;
pragma solidity ^0.5.12;

import "./AccessControl.sol";

contract MarketPlaceCore is AccessControl {

  constructor(address _ethereumDIDRegistry, address _claimRegistry) public {
      registry = EthereumDIDRegistryInterface(_ethereumDIDRegistry); 
      claimRegistry = ClaimRegistryInterface(_claimRegistry);
  }

}