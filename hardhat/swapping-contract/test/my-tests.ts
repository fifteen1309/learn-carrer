import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Lock", function () {
  it("Should set the right unlockTime", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should revert with the right error if called too soon", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });

  it("Should withdraw with the owner address", async function () {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    const [owner, otherAccount] = await hre.ethers.getSigners();
    console.log(otherAccount);

    await time.increaseTo(unlockTime);

    await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
      "You aren't the owner"
    );
  });
});
