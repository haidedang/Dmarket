pragma experimental ABIEncoderV2;
pragma solidity ^0.5.12;

import "./LicenseOwnership.sol";

contract MarketplaceBase is LicenseOwnership {
    struct Sale {
        //unnecessary
        address productId;
        uint256 price;
    }

    struct Review {
        // address issuer;
        address productId;
        uint256 rating;
        bytes description;
    }

    Review[] reviews;

    // prices of an app
    mapping(address => Sale) productIdToSale;
    mapping(address => uint256) productTokenCount;

    event ProductRated(
        address productId,
        uint256 rating,
        bytes description,
        uint256 timestamp
    );

    // interval specifies the duration of the subscription
    event SaleCreated(address productId, uint256 price);

    function _setPrice(address _productId, uint256 _price) internal {
        productIdToSale[_productId].price = _price;
        // PriceChanged();
    }

    function createSale(address _productId, uint256 _price) external {
        // productIdToSale[_productId].price = _price;
        _setPrice(_productId, _price); 
        // productIdToSale[_productId].interval = _interval;
        emit SaleCreated(_productId, _price);
    }

    function _performPurchase(
        address _productId,
        uint256 _numCycles,
        address _assignee
    ) internal returns (uint256) {
        return _createLicense(_productId, _numCycles, _assignee);
    }

    function _createLicense(
        address _productId,
        uint256 _numCycles,
        address _assignee
    ) internal returns (uint256) {
        //uint256 expirationTime = isSubscriptionProduct(_productId) ?
        //    now.add(intervalOf(_productId).mul(_numCycles)) :
        //  0;

        License memory _license = License({
            productId: _productId,
            issuedTime: now,
            expirationTime: _numCycles
        });

        uint256 newLicenseId = licenses.push(_license) - 1;
        productTokenCount[_productId]++;

        emit LicenseIssued(
            _assignee,
            msg.sender,
            newLicenseId,
            _license.productId,
            _license.issuedTime,
            _license.expirationTime
        );
        _mint(_assignee, newLicenseId);
        return newLicenseId;
    }

    function _performRating(
        uint256 tokenId,
        uint256 rating, 
        bytes calldata description
    ) internal {
         Review memory review = Review({
            productId: licenses[tokenId].productId,
            rating: rating,
            description: description
        });

        reviews.push(review);

        emit ProductRated(
            review.productId,
            review.rating,
            review.description,
            block.timestamp
        );
    }

    function _mint(address _to, uint256 _tokenId) internal {
        require(_to != address(0));
        //Transfers ownership per ERC721 draft
        _transfer(address(0), _to, _tokenId);
    }

    function purchaseService(
        address _productId,
        address _assignee,
        uint256 _numCycles
    ) external payable returns (uint256) {
        //  transfer the value of the application to the user.
        require(_productId != address(0));
        require(_assignee != address(0));

        require(msg.value == productIdToSale[_productId].price);

        uint256 licenseId = _performPurchase(_productId, _numCycles, _assignee);

        return licenseId;
    }

    function rateProduct(
        uint256 tokenId,
        uint256 rating,
        bytes calldata description
    ) external {
        require(msg.sender == ownerOf(tokenId));
        _performRating(tokenId, rating, description); 
    }

    function getReviewIndexOfProduct(address productId)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = productTokenCount[productId];

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 resultIndex = 0;

            for (uint256 i = 0; i <= reviews.length; i++) {
                if (productId == reviews[i].productId) {
                    result[resultIndex] = 0;
                    resultIndex++;
                }
            }

            return result;
        }

    }

    function getReviewById(uint256 reviewIndex)
        external
        view
        returns (uint256, bytes memory)
    {
        return (reviews[reviewIndex].rating, reviews[reviewIndex].description);
    }

}
