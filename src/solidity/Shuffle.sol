// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract Shuffle {
    /**
     * @dev Shuffle array of integers
     */
    function shuffle(uint256 entropy, uint32 size)
        private
        pure
        returns (uint32[] memory)
    {
        uint32[] memory result = new uint32[](size);

        // Set the initial randomness based on the provided entropy.
        bytes32 random = keccak256(abi.encodePacked(entropy));

        // Initialize array of numbers starting with 1
        for (uint32 i = 0; i < size; i++) {
            result[i] = i + 1;
        }

        // Set the last item of the array which will be swapped.
        uint32 lastItem = size - 1;

        // We need to do `size - 1` iterations to completely shuffle the array.
        for (uint32 i = 1; i < size - 1; i++) {
            // Select a number based on the randomness.
            uint256 selectedItem = uint256(random) % lastItem;
            // Swap items `selectedItem <> lastItem`.
            uint32 lastItemValue = result[lastItem];

            result[lastItem] = result[selectedItem];
            result[selectedItem] = lastItemValue;

            // Shuffled items are at the end of the array.
            lastItem--;
            // Generate new randomness.
            random = keccak256(abi.encodePacked(random));
        }

        return result;
    }
}
