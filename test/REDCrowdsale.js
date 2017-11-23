'use strict';

const expect = require('chai').expect;

const { advanceToBlock, ether, should, EVMThrow } = require('./utils');
const REDCrowdsale = artifacts.require('./REDCrowdsale.sol');
const REDToken = artifacts.require('./REDToken.sol');

const BigNumber = web3.BigNumber;

contract('REDCrowdsale', function ([_, wallet, wallet2, buyer, purchaser, buyer2, purchaser2]) {
  const initialRate = new web3.BigNumber(1000);
  const value = ether(1);

  const expectedFoundationTokens = new web3.BigNumber(1000);
  const expectedTokenSupply = new web3.BigNumber(5000);

  let startBlock, endBlock, startTime, endTime;
  let crowdsale, token;

  beforeEach(async function () {
    startBlock = web3.eth.blockNumber + 10;
    endBlock = web3.eth.blockNumber + 20;

    crowdsale = await REDCrowdsale.new(
      startBlock,
      endBlock,
      initialRate,
      wallet
    );

    token = REDToken.at(await crowdsale.token());
  });

  it('starts with token paused', async function () {
    const paused = await token.paused();
    paused.should.equal(true);
  });

  it('owner should be able to unpause token after crowdsale ends', async function () {
    await advanceToBlock(endBlock);

    await token.unpause().should.be.rejectedWith(EVMThrow);

    await crowdsale.finalize();

    let paused = await token.paused();
    paused.should.equal(true);

    await token.unpause();

    paused = await token.paused();
    paused.should.equal(false);
  });

  it('buyers should access tokens at price until end of auction', async function () {
    await advanceToBlock(startBlock - 1);

    await crowdsale.buyTokens(buyer, {value, from: purchaser});
    const balance = await token.balanceOf(buyer);
    balance.should.be.bignumber.equal(value.mul(initialRate));
  });

  it('big whale investor should not exceed the cap', async function () {
    const cap = (await crowdsale.cap());
    const overCap = cap.mul(2);
    await crowdsale.buyTokens(buyer, {value: overCap, from: buyer}).should.be.rejectedWith(EVMThrow);
    const balance = await token.balanceOf(buyer);
    const raised = await crowdsale.weiRaised();
    balance.should.be.bignumber.equal(0);
    raised.should.be.bignumber.most(cap);
  });

  it('tokens should be assigned correctly to foundation when finalized', async function () {
    await advanceToBlock(startBlock - 1);

    // since price at first block is 1000, total tokens emitted will be 4000
    await crowdsale.buyTokens(buyer, {value: 4, from: purchaser});

    await advanceToBlock(endBlock);
    await crowdsale.finalize();

    const balance = await token.balanceOf(wallet);
    balance.should.be.bignumber.equal(expectedFoundationTokens);

    const totalSupply = await token.totalSupply();
    totalSupply.should.be.bignumber.equal(expectedTokenSupply);
  });
});
