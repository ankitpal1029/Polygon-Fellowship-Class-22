//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Yangit is ERC20, Ownable {
    uint256 constant _initial_supply = 100 * (10**18);

    constructor() ERC20("Yangit", "YG") {
        _mint(msg.sender, _initial_supply);
    }
}
