# RGB Tokens Crowdsale

## Installation

Run

```
> yarn install
```

## Usage

First run in a console:

```
> yarn run testrpc -l 10000000000
```

Then run in another console:

```
> yarn run truffle migrate
```

Now that the contract is deployed:

```
> yarn run truffle console

truffle> account0 = web3.eth.accounts[0]
truffle> account1 = web3.eth.accounts[1]
truffle> crowdsale = REDCrowdsale.at(REDCrowdsale.address)
truffle> crowdsale.token().then(function(token) { red = REDToken.at(token) });
truffle> crowdsale.sendTransaction({ from: account1, value: web3.toWei(5, "ether")})
truffle> red.balanceOf(account1)
truffle> crowdsale.finalize()
```

## Test

Run

```
> yarn run test
```
