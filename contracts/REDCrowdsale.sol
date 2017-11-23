pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./REDToken.sol";

contract REDCrowdsale is Crowdsale, Ownable, CappedCrowdsale, FinalizableCrowdsale {
    uint256 public constant TOTAL_SHARE = 100;
    uint256 public constant CROWDSALE_SHARE = 80;
    uint256 public constant FOUNDATION_SHARE = 20;
    bool public manuallyEnded = false;

    function REDCrowdsale(
        uint256 _startTime,
        uint256 _endTime,
        uint256 _rate,
        address _wallet
    )
        CappedCrowdsale(16666 ether)
        FinalizableCrowdsale()
        Crowdsale(_startTime, _endTime, _rate, _wallet)
    {
        REDToken(token).pause();
    }

    function createTokenContract() internal returns (MintableToken) {
        return new REDToken();
    }

    function hasEnded() public constant returns (bool) {
        return manuallyEnded || super.hasEnded();
    }

    // After the crowdsale is finished, mint foundation tokens
    function finalization() internal {
        uint256 totalSupply = token.totalSupply();
        uint256 finalSupply = TOTAL_SHARE.mul(totalSupply).div(CROWDSALE_SHARE);

        // emit tokens for the foundation
        token.mint(wallet, FOUNDATION_SHARE.mul(finalSupply).div(TOTAL_SHARE));

        // NOTE: cannot call super here because it would finish minting and
        // the continuous sale would not be able to proceed
        token.transferOwnership(owner);
    }

    function finalize() onlyOwner public {
        manuallyEnded = true;
        super.finalize();
    }
}
