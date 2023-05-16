const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game2", function () {
    async function deployContractAndSetVariables() {
        const Game = await ethers.getContractFactory("Game2");
        const game = await Game.deploy();

        return { game };
    }

    it("should be a winner", async function () {
        const { game } = await loadFixture(deployContractAndSetVariables);

        const switchesToPress = [20, 47, 212];
        for (let i = 0; i < switchesToPress.length; i++) {
            await game.switchOn(switchesToPress[i]);
        }

        await game.win();

        // leave this assertion as-is
        assert(await game.isWon(), "You did not win the game");
    });
});
