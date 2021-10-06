<div>
  <p align="center">
    <img src="client/public/logo.png" width="200px" alt="Insure">
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

## Devnet setup
- If you want to develop and run the project locally make sure you switch to *devnet* branch.
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
