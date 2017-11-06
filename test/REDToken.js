// @flow
'use strict'

const { EVMThrow } = require('./utils')
const REDToken = artifacts.require('./REDToken.sol')

const BigNumber = web3.BigNumber

contract('REDCrowdsale', function ([owner, holder]) {

  let token

  beforeEach(async function () {
    token = await REDToken.new()
  })

  it('cannot burn tokens while paused', async function () {
    await token.mint(holder, 1000)
    await token.pause()
    await token.burn(500, { from: holder }).should.be.rejectedWith(EVMThrow)

    await token.unpause()
    await token.burn(500, { from: holder }).should.be.fulfilled
  })
})
