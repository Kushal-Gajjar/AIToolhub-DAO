// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DAOTreasury
 * @notice Holds and distributes AIT tokens on behalf of the AIToolHub DAO.
 *         Only the Governance contract (EXECUTOR_ROLE) can authorize payouts.
 */
contract DAOTreasury is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    IERC20 public immutable aitToken;

    event FundsDisbursed(address indexed to, uint256 amount, string reason);
    event FundsReceived(address indexed from, uint256 amount);

    constructor(address _aitToken, address _governance) {
        aitToken = IERC20(_aitToken);
        _grantRole(DEFAULT_ADMIN_ROLE, _governance);
        _grantRole(EXECUTOR_ROLE, _governance);
    }

    function disburse(address to, uint256 amount, string calldata reason)
        external onlyRole(EXECUTOR_ROLE) nonReentrant
    {
        require(amount > 0, "Treasury: amount must be > 0");
        require(aitToken.balanceOf(address(this)) >= amount, "Treasury: insufficient funds");
        aitToken.safeTransfer(to, amount);
        emit FundsDisbursed(to, amount, reason);
    }

    function getBalance() external view returns (uint256) {
        return aitToken.balanceOf(address(this));
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}
