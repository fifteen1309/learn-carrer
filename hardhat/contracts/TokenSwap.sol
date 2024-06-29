// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is Ownable(msg.sender) {
    struct Pair {
        IERC20 tokenA;
        IERC20 tokenB;
        uint256 rate; // rate is how much of tokenB you get for 1 tokenA
        bool exists;
    }

    mapping(bytes32 => Pair) public pairs;

    function addPair(address tokenA, address tokenB, uint256 rate) external onlyOwner {
        bytes32 pairId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(!pairs[pairId].exists, "Pair already exists");

        pairs[pairId] = Pair({
            tokenA: IERC20(tokenA),
            tokenB: IERC20(tokenB),
            rate: rate,
            exists: true
        });
    }

    function updateRate(address tokenA, address tokenB, uint256 newRate) external onlyOwner {
        bytes32 pairId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(pairs[pairId].exists, "Pair does not exist");

        pairs[pairId].rate = newRate;
    }

    function deposit(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external onlyOwner {
        bytes32 pairId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(pairs[pairId].exists, "Pair does not exist");

        pairs[pairId].tokenA.transferFrom(msg.sender, address(this), amountA);
        pairs[pairId].tokenB.transferFrom(msg.sender, address(this), amountB);
    }

    function swap(address tokenA, address tokenB, uint256 amountA) external {
        bytes32 pairId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(pairs[pairId].exists, "Pair does not exist");

        Pair storage pair = pairs[pairId];
        uint256 amountB = amountA * pair.rate;

        require(pair.tokenA.transferFrom(msg.sender, address(this), amountA), "Transfer of tokenA failed");
        require(pair.tokenB.transfer(msg.sender, amountB), "Transfer of tokenB failed");
    }
}
