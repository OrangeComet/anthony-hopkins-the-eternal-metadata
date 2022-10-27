import { BigNumber } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";

/**
 * A shuffle algorithm with a deterministic seed phrase. This method uses solidityKeccak256 hashing algorithm in order
 * to maintain compatibility with a Solidity implemenation
 *
 * @param {string} entropy - The random number generated from Chainlink VRF
 * @param {number} size - The number of entries to sort
 * @returns {number[]} The resulting shuffled array
 */
const shuffle = (entropy: string, size: number) => {
  const result = [];
  let random = solidityKeccak256(["uint256"], [entropy]);

  for (let i = 0; i < size; i++) {
    result.push(i + 1);
  }

  let lastItem = size - 1;

  // We need to do `size - 1` iterations to completely shuffle the array.
  for (let i = 1; i < size - 1; i++) {
    // Select a number based on the randomness.
    const selectedItem = Number(BigNumber.from(random).mod(lastItem));

    // Swap items `selectedItem <> lastItem`.
    const lastItemValue = result[lastItem] as number;

    result[lastItem] = result[selectedItem];
    result[selectedItem] = lastItemValue;

    // Shuffled items are at the end of the array.
    lastItem--;
    // Generate new randomness, reassign random value
    random = solidityKeccak256(["uint256"], [random]);
  }

  return result;
};

export { shuffle };
