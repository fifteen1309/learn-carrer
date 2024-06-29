import { expect } from "chai";
import hre from "hardhat";

describe("SwapToken", function () {
  it("Should check", async function () {
    const tokenA = await hre.ethers.deployContract("ERC20Mock", [
      "TokenA",
      "TKA",
      100000,
    ]);
    const tokenB = await hre.ethers.deployContract("ERC20Mock", [
      "TokenB",
      "TKB",
      100000,
    ]);

    const swapToken = await hre.ethers.deployContract("SwapToken");
    await swapToken.addPair(tokenA.target, tokenB.target, 2);

    const abiCoder = new hre.ethers.AbiCoder();
    const pairId =
      "0x40c0b7018177e4d450e64b5a473cd9fe42a2b24d0fbd58dee31d72bd5f990156";

    console.log({ pairId });

    console.log(await swapToken.pairs(pairId));

    expect((await swapToken.pairs(pairId)).rate).to.equal(2);
  });
});
