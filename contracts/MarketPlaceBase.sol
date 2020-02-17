pragma experimental ABIEncoderV2;
pragma solidity ^0.5.12;

import "./EthereumDIDRegistryInterface.sol";
import "./Verifier.sol";
import "./ClaimRegistryInterface.sol";

contract MarketPlaceBase is Verifier {
    EthereumDIDRegistryInterface public registry;
    ClaimRegistryInterface claimRegistry;

    bytes32 public constant DELEGATE_ADMIN = keccak256(bytes("admin"));

    mapping(address => address) EntityOwner;

    function registerEntity(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address newOwner
    ) public {
        registry.changeOwnerSigned(identity, sigV, sigR, sigS, address(this));
        EntityOwner[identity] = newOwner;
    }

    function setData(
        address identity,
        bytes32 name,
        bytes memory value,
        uint256 validity
    ) public {
        // another smart contract could define this in his own ways!
        require(
            EntityOwner[identity] == msg.sender ||
                registry.validDelegate(
                    EntityOwner[identity],
                    DELEGATE_ADMIN,
                    msg.sender
                ) ||
                registry.validDelegate(identity, DELEGATE_ADMIN, msg.sender)
        );

        registry.setAttribute(identity, name, value, validity);
    }

    function addMember(address identity, bytes32 memberType, address member)
        public
    {
        registry.addDelegate(identity, memberType, member, 20000);
    }

    function _deleteEntity() internal {}

}
