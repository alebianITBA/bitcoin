const REDCrowdsale = artifacts.require("./REDCrowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(REDCrowdsale);
};
