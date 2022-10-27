# Anthony Hopkins - The Eternal Metadata

This repository contains information on the randomization process Orange Comet used for `Anthony Hopkins - The Eternal`.

## Introduction

_Why is randomization transparency important?_ In collections where specific tokens have attributes designed to give more rarity, the community may designate such tokens as having higher value. Transparency in any "shuffle" or added utility assures the community that the process is fair to all who participate.

After reviewing various solutions, we selected Chainlink VRF because it’s based on cutting-edge academic research, supported by a time-tested oracle network, and secured through the generation and on-chain verification of cryptographic proofs that prove the integrity of each random number supplied to smart contracts.

By integrating the industry-leading decentralized oracle network, we now have access to a tamper-proof and auditable source of randomness needed to help randomize the unique characteristics of the NFTs for the art reveal and to help randomize the distribution of rewards to NFT owners. Ultimately this creates a more exciting and transparent user experience, as users can have high confidence that the randomness used in the art reveal and winner selection process is provably fair.

For additional information check out our blog post on [The Eternal Collection Uses Chainlink VRF to Help Power Fair NFT Reveal and Winner Selection](https://orangecomet.com/eternal-collection-chainlink-vrf/)

## Randomization Process

The original metadata files (1000 in total) are contained in the [sorted-metadata](./sorted-metadata/) directory. These files were sorted alphabetically by group title and number.
Orange Comet used [Chainlink's VRF](https://docs.chain.link/docs/vrf/v2/introduction/) product to generate a random number to seed the shuffle method.

The [RandomNumberGenerator](https://etherscan.io/address/0x723f9c44472a17e8f46a86c0ab5befccbbf20ec7) contract makes the requests for the random number with parameters for tracking the purpose of the request. The method `requestRandomWords` is outlined below:

```solidity
  /**
   * @notice Makes a random request
   * Assumes the subscription is funded sufficiently; "Words" refers to unit of data in Computer Science
   *
   * @param partnerContract the address of the partner contract
   * @param totalEntries the total number of entries to randomize
   * @param totalSelections the number of selections to return
   * @param title the title used to write the logs
   */
  function requestRandomWords(
    address partnerContract,
    uint32 totalEntries,
    uint32 totalSelections,
    string calldata title
  ) external onlyOwner {
    // Will revert if subscription is not set and funded.
    uint256 requestId = COORDINATOR.requestRandomWords(
      _keyHash,
      _subscriptionId,
      REQUEST_CONFIRMATIONS,
      CALLBACK_GAS_LIMIT,
      NUM_WORDS
    );

    requests[requestId] = Params(
      partnerContract,
      totalEntries,
      totalSelections,
      title
    );
  }
```

Once Chainlink's oracles have generated a random number, the `fulfillRandomWords` function will be called with the initial request ID and resulting `randomWords`. The result will emit a `ReturnedRandomWord` event in order to signal the generator was successfully called. An example of this can be [viewed on Etherscan](https://etherscan.io/tx/0x3383c64edb01f5c5b3cb5484ad7647bdc9583bd05863db4191801d8b9f2b9334#eventlog)

```solidity
  /**
   * @notice Callback function used by VRF Coordinator
   *
   * @param requestId - the requestId from the VRF Coordinator
   * @param randomWords - array of random results from VRF Coordinator
   */
  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
    internal
    override
  {
    emit ReturnedRandomWord(randomWords[0], requestId, requests[requestId]);
  }
```

## Frontend Verification

For convenience an [application](https://rng-verification.orangecomet.io/) was developed to take a `fulfillRandomWords` transaction (implemented by an Orange Comet RandomNumberGenerator contract), parse the logs and shuffle the results using [the shuffle method](./src/typescript/tools.ts). The web application also allows us to disqualify certain tokens based on conditions such as already existing utility and flagged wallets.

## Results

- [Collection Randomization](https://rng-verification.orangecomet.io/0x3383c64edb01f5c5b3cb5484ad7647bdc9583bd05863db4191801d8b9f2b9334)
- [Audio Message From Sir Anthony (100 Tokens)](https://rng-verification.orangecomet.io/0x50affeb31edc124c71b788d2c4f81ae6f6c25f15d83aadbc70889229e136f059?ignore=98,157,274,343,489,500,529,774,786,820,283,455,634,635,636,266,267,268)
- [Dreamscapes Art Book (39 Tokens)](https://rng-verification.orangecomet.io/0x3891504968ae4c79b420008ed22c532ea7fe040d0aaae2e5d09a900e4370a0d9?ignore=98,157,274,343,489,500,529,774,786,820,283,455,634,635,636,266,267,268)
- [Seat at Zoom Call with Sir Anthony (5 Tokens)](https://rng-verification.orangecomet.io/0xf028b3c192ccbaae2fd9bf644512b5b231ec4a320d4a1856b617a85e8110d8b8?ignore=98,157,274,343,489,500,529,774,786,820,283,455,634,635,636,266,267,268)
- [One on One with Sir Anthony (1 Token)](https://rng-verification.orangecomet.io/0x5fa098c872760724796b1391a8426f1c3ba32ca7344ea864aeb2903d76bbe1b4?ignore=98,157,274,343,489,500,529,774,786,820,283,455,634,635,636,266,267,268)
