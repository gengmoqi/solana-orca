# orca-test

Adopted from [Orca Typescript SDK](https://github.com/orca-so/typescript-sdk)

## Installation

Use your environment's package manager to install @orca-so/sdk and other related packages into your project.

```bash
yarn add @orca-so/sdk @solana/web3.js decimal.js
```

## Setup TODOs
- [ ] Replace your own private key string
- [ ] Use your own rpc and ws url to setup connection
- [ ] Randomize the amount to bypass dedup
- [ ] Play around with the batchSize parameter

## Run

To run txs that swaps SOL for ORCA:
```bash
npx ts-node swap_sol2orca.ts
```

To run txs that swaps ORCA back for SOL:
```bash
npx ts-node swap_orca2sol.ts
```