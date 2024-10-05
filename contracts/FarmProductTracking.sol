// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmProductTracking {
    struct Product {
        uint256 productId;
        string name;
        string description;
        uint256 price;
        uint256 weight;
        string category;
        string subCategory;
        address owner;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductAdded(
        uint256 productId,
        string name,
        string description,
        uint256 price,
        uint256 weight,
        string category,
        string subCategory,
        address owner
    );

    event PreviousStakeholderUpdated(address newStakeholder);

    event ProductBought(uint256 productId, address buyer, address seller, uint256 price);

    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _weight,
        string memory _category,
        string memory _subCategory,
        address _owner
    ) external {
        require(_weight > 0, "Weight cannot be zero");
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _description,
            _price,
            _weight,
            _category,
            _subCategory,
            _owner
        );
        emit ProductAdded(
            productCount,
            _name,
            _description,
            _price,
            _weight,
            _category,
            _subCategory,
            _owner
        );
    }

    function updatePreviousStakeholder(address _newStakeholder) external {
    require(productCount > 0, "No products available");
    uint256 _productId = productCount;
    products[_productId].owner = _newStakeholder;
    emit PreviousStakeholderUpdated( _newStakeholder);
}


    function buyProduct(uint256 _productId) external payable {
        require(_productId <= productCount, "Product does not exist");
        Product storage product = products[_productId];
        require(msg.value == product.price, "Incorrect value sent");
        require(product.owner != address(0), "Product has no owner");
        require(product.owner != msg.sender, "Buyer cannot be the owner");

        address seller = product.owner;
        product.owner = msg.sender;

        payable(seller).transfer(msg.value);

        emit ProductBought(_productId, msg.sender, seller, product.price);
        emit PreviousStakeholderUpdated( msg.sender);
    }
}




// pragma solidity ^0.8.0;

// contract FarmProductTracking {
//     struct Product {
//         uint256 productId;
//         string name;
//         string description;
//         uint256 price;
//         uint256 weight;
//         string category;
//         string subCategory;
//         address owner;
//     }

//     mapping(uint256 => Product) public products;
//     uint256 public productCount;

//     event ProductAdded(
//         uint256 productId,
//         string name,
//         string description,
//         uint256 price,
//         uint256 weight,
//         string category,
//         string subCategory,
//         address owner
//     );

//     event ProductBought(uint256 productId, address buyer, address seller, uint256 price);

//     function addProduct(
//         string memory _name,
//         string memory _description,
//         uint256 _price,
//         uint256 _weight,
//         string memory _category,
//         string memory _subCategory,
//         address _owner
//     ) external {
//         require(_weight > 0, "Weight cannot be zero");
//         productCount++;
//         products[productCount] = Product(
//             productCount,
//             _name,
//             _description,
//             _price,
//             _weight,
//             _category,
//             _subCategory,
//             _owner
//         );
//         emit ProductAdded(
//             productCount,
//             _name,
//             _description,
//             _price,
//             _weight,
//             _category,
//             _subCategory,
//             _owner
//         );
//     }

//     function buyProduct(uint256 _productId) external payable {
//         require(_productId <= productCount, "Product does not exist");
//         Product storage product = products[_productId];
//         require(msg.value == product.price, "Incorrect value sent");
//         require(product.owner != address(0), "Product has no owner");
//         require(product.owner != msg.sender, "Buyer cannot be the owner");

//         address seller = product.owner;
//         product.owner = msg.sender;

//         payable(seller).transfer(msg.value);

//         emit ProductBought(_productId, msg.sender, seller, product.price);
//     }
// }





