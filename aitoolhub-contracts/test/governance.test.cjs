const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIToolHub DAO Contracts", () => {
  let token, timelock, governance, treasury, owner, voter1, voter2;

  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();

    const AITToken = await ethers.getContractFactory("AITToken");
    token = await AITToken.deploy(owner.address);

    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelock = await TimelockController.deploy(0, [owner.address], [owner.address], owner.address);

    const DAOGovernance = await ethers.getContractFactory("DAOGovernance");
    governance = await DAOGovernance.deploy(await token.getAddress(), await timelock.getAddress());

    const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
    treasury = await DAOTreasury.deploy(await token.getAddress(), await governance.getAddress());

    await token.transfer(voter1.address, ethers.parseEther("1000"));
    await token.transfer(voter2.address, ethers.parseEther("500"));
    await token.connect(voter1).delegate(voter1.address);
    await token.connect(voter2).delegate(voter2.address);
  });

  it("should have correct token name and symbol", async () => {
    expect(await token.name()).to.equal("AIToolHub Token");
    expect(await token.symbol()).to.equal("AIT");
  });

  it("should allow token transfer", async () => {
    const balance = await token.balanceOf(voter1.address);
    expect(balance).to.equal(ethers.parseEther("1000"));
  });

  it("should enforce max supply", async () => {
    const max = await token.MAX_SUPPLY();
    const minting = max + 1n;
    await expect(token.mint(owner.address, minting)).to.be.revertedWith("AIT: cap exceeded");
  });

  it("should report treasury balance", async () => {
    const balance = await treasury.getBalance();
    expect(balance).to.equal(0n);
  });
});
