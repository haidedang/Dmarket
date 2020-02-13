pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Verifier {
    uint256 public constant chainId = 1580457587570;
    address public constant verifyingContract = 0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;
    bytes32 public constant salt = 0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558;
    
    string private constant EIP712_DOMAIN  = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)";
    string private constant IDENTITY_TYPE = "Identity(uint256 userId,address wallet)";
    string private constant BID_TYPE = "Bid(uint256 amount,Identity bidder)Identity(uint256 userId,address wallet)";
    string private constant APP_TYPE = "App(address author,string appName,string description,string downloadLink,address[] supportedApp)";
    
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    bytes32 private constant IDENTITY_TYPEHASH = keccak256(abi.encodePacked(IDENTITY_TYPE));
    bytes32 private constant BID_TYPEHASH = keccak256(abi.encodePacked(BID_TYPE));
    bytes32 private constant APP_TYPEHASH = keccak256(abi.encodePacked(APP_TYPE)); 
    
    bytes32 private constant DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        keccak256("Marketplace Registry"),
        keccak256("1"),
        chainId,
        verifyingContract,
        salt
    ));
    
    struct App {
        address author;
        string appName;
        string description;
        string downloadLink;
        address[] supportedApp;
    }
    
    struct Identity {
        uint256 userId;
        address wallet;
    }
    
    struct Bid {
        uint256 amount;
        Identity bidder;
    }
    
    function hashIdentity(Identity memory identity) private pure returns (bytes32) {
        return keccak256(abi.encode(
            IDENTITY_TYPEHASH,
            identity.userId,
            identity.wallet
        ));
    }
    
    function hashBid(Bid memory bid) private pure returns (bytes32){
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                BID_TYPEHASH,
                bid.amount,
                hashIdentity(bid.bidder)
            ))
        ));
    }
    
    // App control function 
    //@param: complete App Struct. This will need to be passed by the client. 
    function hashApp(App memory app) private pure returns (bytes32){
        // once you register an App, you give ownership to the marketplace
        // app.
       // require(app.owner == entityOwner[app]); 
        
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                APP_TYPEHASH,
                app.author,
                keccak256(bytes(app.appName)),
                keccak256(bytes(app.description)),
                keccak256(bytes(app.downloadLink)),
                keccak256(abi.encodePacked(app.supportedApp))
            ))
        ));
    }
    
     function verifyApp
     (address author, string memory appName,
     string memory description,
      string memory downloadLink, address[] memory supportedApp, bytes32 sigR,
       bytes32 sigS, uint8 sigV) public view returns (bool)
     {

        App memory app = App({
            author: author,
            appName: appName,
            description: description,
            downloadLink: downloadLink,
            supportedApp: supportedApp
        });

      
        
        //check if the signature will return true
        // set Attribute Signature : IPFS HASH. 
        // Simple Question again. Who wants to verify the App and what does he want to verify?
        // The EndUser who uses a service or even the centralized server. Now the server would want to know, 
        // If the data which has been registered, is really the same as the IPFS hashApp
        // Since he can only registers it when following certain guidelines, he still would need a way to know,
        // that the IFPS hash is really the data which has been put in to be verified. 
        // He could say that it is another app address which belongs to him, though it does not. and then provide a fake link, so that users get tricked into downloading scam. 
        // So the IPFS HAsh will be the App struct, a piece of data that gets signed. 
        // The signature of what is being accepted will need to be the same then on the IPFS HAsh object. So if I fetch the IPFS Object and I put in the signature I should get out the author of that thing. 
        // Who is the author of that thing? I obviously want to know the author of that thing. Only the author of that thing will give me the right signature, cause only the author has the key. 
        // IPFS Hash and signature should therefore return me the author of that 
        
        return app.author == ecrecover(hashApp(app), sigV, sigR, sigS);
    }

    function test() public view returns(string memory ){
        string memory d = 'hey';
        return d;
    }
    
}