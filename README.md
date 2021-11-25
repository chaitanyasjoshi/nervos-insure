<div>
  <p align="center">
    <img src="client/public/static/images/logo.png" width="200px" alt="Insure">
  </p>
  <hr>
  <h2 align="center">Insure DeFi</h2>
    <p align="center">Collateral Protection Insurance for Crypto-backed Loans. Policy pays 100% of the issued loan amount if value of collateral provided by the borrower (i.e. ETH, or tokenized asset) drops by 90% or more.</p>
    <p align="center">
      <i>*Current policy only supports ETH as collateral. But in the future it will support more tokens and tokenized assets such as car.</i>
    </p>
  <hr>
</div>

## Features

- Collateral protection for your tokens and tokenized assets
- Pay a one time premium
- Supply capital to earn APY
- Withdraw your funds anytime
- Automated price updates using oracles

## Future work

- Setup CRON service for price update
- Inclusion of ERC20 tokens
- Inclusion of ERC721 tokenized assets
- DAO

## Testnet address

InsuranceProvider

```
0x5C8de88dB93b9D28b480a355027E18bC571925c7
```

Pool

```
0xE0B0143Cd556f85dE0d71594c8c2195a681e3a03
```

## Devnet setup

- If you want to develop and run the project locally make sure you switch to _devnet_ branch.
- Deploy [chainlink nervos](https://github.com/Kuzirashi/chainlink-nervos) and copy feed registry address
- Change the feed registry address in [InsuranceProvider](contracts/InsuranceProvider.sol) and [InsuranceContract](contracts/InsuranceContract.sol)

### Prerequisites

- Node.js 12+ environment is required to use this repo.

### Install Truffle

```
npm install -g truffle
```

### Clone repo

```
git clone https://github.com/chaitanyasjoshi/nervos-insure.git
cd nervos-insure
```

### Install dependancies

```
npm install
```

### Deploy contracts

Before deploying, create a .env file in the root directory and set PRIVATE_KEY=<YOUR_ETH_PRIVATE_KEY>

```
npm deploy
```

## Frontend

### Install dependancies

```
cd client
npm install
```

### Deploy

```
npm run dev
```
