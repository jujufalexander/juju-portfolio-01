// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract WalletConnector {
    address[] public whitelist;

    function connectWallet(address _walletAddress) public {
        whitelist.push(_walletAddress);
    }

    function getWhitelistMembers() public view returns (address[] memory) {
        return whitelist;
    }
}
