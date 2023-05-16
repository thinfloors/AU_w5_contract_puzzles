// adding line to test commits.

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game4", function () {
    async function deployContractAndSetVariables() {
        const Game = await ethers.getContractFactory("Game4");
        const game = await Game.deploy();

        const [signer] = await ethers.getSigners();
        const signerAddr = await signer.getAddress();

        return { game, signerAddr };
    }
    it("should be a winner", async function () {
        const { game, signerAddr } = await loadFixture(
            deployContractAndSetVariables
        );

        // nested mappings are rough :}
        await game.write(signerAddr);
        await game.win(signerAddr);

        // leave this assertion as-is
        assert(await game.isWon(), "You did not win the game");
    });
});
