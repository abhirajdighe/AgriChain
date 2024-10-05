const { expect } = require("chai");

describe("FarmProductTracking", function () {
  let FarmProductTracking;
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    FarmProductTracking = await ethers.getContractFactory("FarmProductTracking");
    [owner, addr1, addr2] = await ethers.getSigners();
    contract = await FarmProductTracking.deploy();
    await contract.deployed();
  });

  describe("addProduct", function () {
    it("should add a new product correctly", async function () {
      await contract.addProduct(
        "Product1",
        "Description1",
        ethers.utils.parseUnits("1", "ether"),
        10,
        "Category1",
        "SubCategory1",
        owner.address
      );

      const product = await contract.products(1);
      expect(product.name).to.equal("Product1");
    });

    it("should increment productCount", async function () {
      await contract.addProduct(
        "Product1",
        "Description1",
        ethers.utils.parseUnits("1", "ether"),
        10,
        "Category1",
        "SubCategory1",
        owner.address
      );

      const productCount = await contract.productCount();
      expect(productCount).to.equal(1);
    });

    it("should emit ProductAdded event", async function () {
      await expect(
        contract.addProduct(
          "Product1",
          "Description1",
          ethers.utils.parseUnits("1", "ether"),
          10,
          "Category1",
          "SubCategory1",
          owner.address
        )
      )
        .to.emit(contract, "ProductAdded")
        .withArgs(
          1,
          "Product1",
          "Description1",
          ethers.utils.parseUnits("1", "ether"),
          10,
          "Category1",
          "SubCategory1",
          owner.address
        );
    });

    it("should revert if weight is zero", async function () {
      await expect(
        contract.addProduct(
          "Product1",
          "Description1",
          ethers.utils.parseUnits("1", "ether"),
          0,
          "Category1",
          "SubCategory1",
          owner.address
        )
      ).to.be.revertedWith("Weight cannot be zero");
    });
  });

  describe("updatePreviousStakeholder", function () {
    beforeEach(async function () {
      await contract.addProduct(
        "Product1",
        "Description1",
        ethers.utils.parseUnits("1", "ether"),
        10,
        "Category1",
        "SubCategory1",
        owner.address
      );
    });

    it("should update the product owner", async function () {
      await contract.updatePreviousStakeholder(1, addr1.address);
      const product = await contract.products(1);
      expect(product.owner).to.equal(addr1.address);
    });

    it("should emit PreviousStakeholderUpdated event", async function () {
      await expect(contract.updatePreviousStakeholder(1, addr1.address))
        .to.emit(contract, "PreviousStakeholderUpdated")
        .withArgs(1, addr1.address);
    });

    it("should revert if product does not exist", async function () {
      await expect(contract.updatePreviousStakeholder(2, addr1.address)).to.be.revertedWith("Product does not exist");
    });
  });

  describe("buyProduct", function () {
    beforeEach(async function () {
      await contract.addProduct(
        "Product1",
        "Description1",
        ethers.utils.parseUnits("1", "ether"),
        10,
        "Category1",
        "SubCategory1",
        owner.address
      );
    });

    it("should transfer ownership on purchase", async function () {
      await contract.connect(addr1).buyProduct(1, { value: ethers.utils.parseUnits("1", "ether") });
      const product = await contract.products(1);
      expect(product.owner).to.equal(addr1.address);
    });

    it("should emit ProductBought and PreviousStakeholderUpdated events", async function () {
      await expect(contract.connect(addr1).buyProduct(1, { value: ethers.utils.parseUnits("1", "ether") }))
        .to.emit(contract, "ProductBought")
        .withArgs(1, addr1.address, owner.address, ethers.utils.parseUnits("1", "ether"))
        .and.to.emit(contract, "PreviousStakeholderUpdated")
        .withArgs(1, addr1.address);
    });

    it("should revert if incorrect value is sent", async function () {
      await expect(contract.connect(addr1).buyProduct(1, { value: ethers.utils.parseUnits("0.5", "ether") })).to.be.revertedWith("Incorrect value sent");
    });

    it("should revert if product does not exist", async function () {
      await expect(contract.connect(addr1).buyProduct(2, { value: ethers.utils.parseUnits("1", "ether") })).to.be.revertedWith("Product does not exist");
    });

    it("should revert if buyer is the owner", async function () {
      await expect(contract.buyProduct(1, { value: ethers.utils.parseUnits("1", "ether") })).to.be.revertedWith("Buyer cannot be the owner");
    });

    it("should transfer the funds to the seller", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await contract.connect(addr1).buyProduct(1, { value: ethers.utils.parseUnits("1", "ether") });
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseUnits("1", "ether"));
    });
  });

  describe("Edge cases", function () {
    beforeEach(async function () {
      await contract.addProduct(
        "Product1",
        "Description1",
        ethers.utils.parseUnits("1", "ether"),
        10,
        "Category1",
        "SubCategory1",
        owner.address
      );
    });

    it("should not allow adding product with zero weight", async function () {
      await expect(
        contract.addProduct(
          "Product1",
          "Description1",
          ethers.utils.parseUnits("1", "ether"),
          0,
          "Category1",
          "SubCategory1",
          owner.address
        )
      ).to.be.revertedWith("Weight cannot be zero");
    });

    it("should not allow updating non-existent product", async function () {
      await expect(contract.updatePreviousStakeholder(999, addr1.address)).to.be.revertedWith("Product does not exist");
    });

    it("should not allow buying non-existent product", async function () {
      await expect(contract.connect(addr1).buyProduct(999, { value: ethers.utils.parseUnits("1", "ether") })).to.be.revertedWith("Product does not exist");
    });

    it("should not allow buying product with incorrect price", async function () {
      await expect(contract.connect(addr1).buyProduct(1, { value: ethers.utils.parseUnits("0.5", "ether") })).to.be.revertedWith("Incorrect value sent");
    });

    it("should not allow buyer to be the current owner", async function () {
      await expect(contract.buyProduct(1, { value: ethers.utils.parseUnits("1", "ether") })).to.be.revertedWith("Buyer cannot be the owner");
    });
  });
});
