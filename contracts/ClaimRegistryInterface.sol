pragma solidity ^0.5.12;

interface ClaimRegistryInterface {
    
    event ClaimSet(
        address indexed issuer,
        address indexed subject,
        bytes32 indexed key,
        bytes32 value,
        uint updatedAt);

    event ClaimRemoved(
        address indexed issuer,
        address indexed subject,
        bytes32 indexed key,
        uint removedAt);

    function setClaim(address subject, bytes32 key, bytes32 value) external;
    function setSelfClaim(bytes32 key, bytes32 value) external;
    function getClaim(address issuer, address subject, bytes32 key) external view returns(bytes32);
    function removeClaim(address issuer, address subject, bytes32 key) external;

}

