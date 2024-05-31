# 🧠 Think2Earn ♦ 

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 Brain Crypto Interfaces suggests the use of incentives for uploading brain data to improve open source classification models. Commmunication privacy and security between users can be leveraged with Waku communication protocols.  

# add photos from Imagenet-EEG

### Mega Description

This smart contract system provides a decentralized platform for BCI (Brain-Computer Interface) data transactions, designed to benefit both data buyers and BCI owners. It allows data buyers to request and gather diverse datasets to improve their existing models, while providing a mechanism for BCI owners to get paid for their data contributions.

#### For BCI Data Buyers:

Data buyers can create bounties on the platform to request specific types of data, including photos, videos, text, and audio. These bounties are designed to collect BCI data from participants who engage with the requested media content. The collected BCI data can then be used to enhance the buyer's models, improving classification capabilities or other aspects of their data-driven projects.

#### For BCI Owners:

BCI owners can visit the platform and browse available bounties. They can participate by watching the provided media content and uploading their BCI data. If the uploaded data is deemed valuable and improves the buyer's model, the bounty creator can decide to pay the BCI owner. This decision is based on the buyer's assessment of the data's utility, thus requiring some level of trust from the seller.

#### Bounty Management:

The platform supports the creation and management of bounties with detailed attributes:


#### Workflow:

1. **Creating Bounties**:
   - Data buyers create bounties by specifying all required details, including the type of data needed and the reward amount.
   - These bounties are stored on-chain, with descriptions possibly linked to external resources for detailed information.

2. **Participating in Bounties**:
   - BCI owners select bounties of interest, engage with the specified media content, and collect their BCI data.
   - They then submit/upload this data through the platform, associating it with the relevant bounty.

3. **Evaluating Submissions**:
   - The bounty creator reviews the submissions within the specified judge time.
   - If a submission is found to improve the classification capability of the model, the bounty creator can approve and pay the participant. Trust required in the Bounty Creator. 
   - Payment is made in Ether, directly transferred to the participant's address.

### Summary

This platform is a crypto marketplace for buying and selling BCI data, benefiting both data buyers looking to enhance their models and BCI owners seeking to monetize their data. Inspired by Vitalik's blogpost on techno-optimism, it leverages incentives to create datasets that can be used for decoding brain inputs and controlling hardware, eventually minimizing the feedback loop between humans and machines. 

# 🏗 Scaffold-ETH 2

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone git@github.com:ETHPrague-BRX/think2earn.git
cd think2earn
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
- Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
