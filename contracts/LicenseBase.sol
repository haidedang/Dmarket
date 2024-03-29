pragma solidity ^0.5.12;

/**
 * @title LicenseBase
 * @notice This contract defines the License data structure and how to read from it
 */

contract LicenseBase {
    /**
   * @notice Issued is emitted when a new license is issued
   */
    event LicenseIssued(
        address indexed owner,
        address indexed purchaser,
        uint256 licenseId,
        address productId,
        uint256 attributes,
        uint256 issuedTime,
        uint256 expirationTime
    );

    event LicenseRenewal(
        address indexed owner,
        address indexed purchaser,
        uint256 licenseId,
        address productId,
        uint256 expirationTime
    );

    struct License {
        address productId;
        uint256 attributes;
        uint256 issuedTime;
        uint256 expirationTime;
    }

    /**
   * @notice All licenses in existence.
   * @dev The ID of each license is an index in this array.
   */
    License[] licenses;

    /** internal **/
    function _isValidLicense(uint256 _licenseId) internal view returns (bool) {
        return licenseProductId(_licenseId) != address(0);
    }

    /**
   * @notice Get a license's productId
   * @param _licenseId the license id
   */
    function licenseProductId(uint256 _licenseId)
        public
        view
        returns (address)
    {
        return licenses[_licenseId].productId;
    }

    /**
   * @notice Get a license's attributes
   * @param _licenseId the license id
   */
    function licenseAttributes(uint256 _licenseId)
        public
        view
        returns (uint256)
    {
        return licenses[_licenseId].attributes;
    }

    /**
   * @notice Get a license's issueTime
   * @param _licenseId the license id
   */
    function licenseIssuedTime(uint256 _licenseId)
        public
        view
        returns (uint256)
    {
        return licenses[_licenseId].issuedTime;
    }

    /**
   * @notice Get a license's issueTime
   * @param _licenseId the license id
   */
    function licenseExpirationTime(uint256 _licenseId)
        public
        view
        returns (uint256)
    {
        return licenses[_licenseId].expirationTime;
    }

    /**
   * @notice Get a license's info
   * @param _licenseId the license id
   */
    function licenseInfo(uint256 _licenseId)
        public
        view
        returns (address, uint256, uint256, uint256)
    {
        return (
            licenseProductId(_licenseId),
            licenseAttributes(_licenseId),
            licenseIssuedTime(_licenseId),
            licenseExpirationTime(_licenseId)
        );
    }

}
