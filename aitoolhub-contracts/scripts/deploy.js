const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy AIT Token
  const AITToken = await ethers.getContractFactory("AITToken");
  const token = await AITToken.deploy(deployer.address);
  await token.waitForDeployment();
  console.log("AITToken deployed to:", await token.getAddress());

  // 2. Deploy Timelock (required by Governor)
  const TimelockController = await ethers.getContractFactory("TimelockController");
  const timelock = await TimelockController.deploy(
    172800, // 2 day min delay
    [deployer.address],
    [deployer.address],
    deployer.address
  );
  await timelock.waitForDeployment();
  console.log("TimelockController deployed to:", await timelock.getAddress());

  // 3. Deploy Governance
  const DAOGovernance = await ethers.getContractFactory("DAOGovernance");
  const governance = await DAOGovernance.deploy(
    await token.getAddress(),
    await timelock.getAddress()
  );
  await governance.waitForDeployment();
  console.log("DAOGovernance deployed to:", await governance.getAddress());

  // 4. Deploy Treasury
  const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
  const treasury = await DAOTreasury.deploy(
    await token.getAddress(),
    await governance.getAddress()
  );
  await treasury.waitForDeployment();
  console.log("DAOTreasury deployed to:", await treasury.getAddress());

  // 5. Transfer initial tokens to treasury
  const treasuryAmount = ethers.parseEther("50000");
  await token.transfer(await treasury.getAddress(), treasuryAmount);
  console.log(`Transferred ${ethers.formatEther(treasuryAmount)} AIT to Treasury`);

  console.log("\n=== Deployment Summary ===");
  console.log(`AITToken:       ${await token.getAddress()}`);
  console.log(`TimelockCtrl:   ${await timelock.getAddress()}`);
  console.log(`DAOGovernance:  ${await governance.getAddress()}`);
  console.log(`DAOTreasury:    ${await treasury.getAddress()}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
