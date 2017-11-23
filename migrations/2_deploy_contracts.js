const REDCrowdsale = artifacts.require("./REDCrowdsale.sol");

module.exports = function(deployer, network, accounts) {
  // const startTime = 1511730000; // November 26, 2017 6:00:00 PM GMT-03:00
  // const endTime = 1511920800; // November 28, 2017 11:00:00 PM GMT-03:00
  const block = web3.eth.getBlock("latest");
  const startTime = block.timestamp;
  const endTime = startTime + 10000;

  const rate = new web3.BigNumber(1000);
  const wallet = accounts[0];

  deployer.deploy(REDCrowdsale, startTime, endTime, rate, wallet);
};
