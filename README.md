# 🧠 Think2Earn ♦ 


![DALLE2024-06-0114 30 55-CreateaseriesofminimalisticlogosforacryptoprojectfeaturinganimageofabrainandincorporatingcryptoconceptsliketheEthereumETHlog-ezgif com-webp-to-jpg-converter](https://github.com/ETHPrague-BRX/think2earn/assets/83903147/d74bf393-d6a0-46de-a283-d91018edd5c8)


🧪 Brain Crypto Interfaces suggests the use of incentives for uploading brain data to improve open source classification models. Commmunication privacy and security between users can be leveraged with Waku communication protocols.  

![image](https://github.com/ETHPrague-BRX/think2earn/assets/83903147/c6f32b8e-c1a4-4962-b6ef-15f9d70afe71)

In the images above, on the right column, Ground Truth (GT) represents the images that had been seen by participants while wearing a non-invasive EEG BCI. 
Samples 1 through 3 were outputted by the model without "seeing" the GT - showing that visual stimuli can be decoded from EEG data. [Image source](https://arxiv.org/pdf/2306.16934).  

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

![Screenshot 2024-06-02 at 09-43-29 Think2Earn Contract Flowchart with User Interactions](https://github.com/ETHPrague-BRX/think2earn/assets/83903147/3a4e144b-9e8c-4401-a87a-767fed905d8b)


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
<img width="1447" alt="Screenshot 2024-06-02 at 11 00 30" src="https://github.com/ETHPrague-BRX/think2earn/assets/85355882/5f51465b-aaa1-4499-8ecc-09ddb9e097a3">

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

* Subraph commands:
```
yarn deploy --reset
yarn clean-node
yarn run-node
yarn local-create
yarn abi-copy && yarn codegen
yarn local-ship
```
And then check in subgraph page
![graph](https://github.com/ETHPrague-BRX/think2earn/assets/4788589/d36eed42-ca66-4cff-ad01-88200c7e3997)

* Optimism Sepolia Graph deployment steps:
```
# ! Skip the graph init step, it's already the 'packages/subgraph' folder
cp packages/subgraph
graph auth --studio KEY_FROM_GRAPH_STUDIO_PAGE
graph codegen && graph build
graph deploy --studio name_of_your_subgraph
```

* Vercel deployment:
```
yarn vercel --build-env NEXT_PUBLIC_IGNORE_BUILD_ERROR=true
```

Then check if current schema is visible under:
https://thegraph.com/studio/subgraph/think2earn/playground

Optimism Sepolia deployment address:
https://sepolia-optimism.etherscan.io/address/0x5B6260d9dB1e105c829704FcDC2b65E1399807Ee

Mantle mainnet deployment address:
https://mantlescan.xyz/address/0x5B6260d9dB1e105c829704FcDC2b65E1399807Ee#code

