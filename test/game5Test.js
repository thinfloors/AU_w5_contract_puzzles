const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { utils } = require("ethers");

describe("Game5", function () {
    async function deployContractAndSetVariables() {
        const Game = await ethers.getContractFactory("Game5");
        const game = await Game.deploy();

        const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;
        let isLower = false;
        let walletArr = [];
        while (isLower === false) {
            let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
            let walletAddr = await wallet.getAddress();
            walletArr.push(wallet);
            if (
                // Originally testing first 3 chars, but can just use inequality for
                // the threshold
                /*
                walletAddr[2] === "0" &&
                walletAddr[3] === "0" &&
                walletAddr[4] !== "F"
                */
                walletAddr < threshold
            ) {
                isLower = true;
            }
        }

        const finalWallet = walletArr[walletArr.length - 1];
        const finalAddr = await finalWallet.getAddress();

        // Since address was created new, it is empty and needs to be sent some
        // eth for gas

        const [, signer] = await ethers.getSigners();
        await signer.sendTransaction({
            to: finalAddr,
            value: utils.parseEther("0.5"),
        });

        return { game, finalWallet, finalAddr, signer };
    }
    it("should be a winner", async function () {
        const { game, finalWallet } = await loadFixture(
            deployContractAndSetVariables
        );

        await game.connect(finalWallet).win();

        // leave this assertion as-is
        assert(await game.isWon(), "You did not win the game");
    });
});
