const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function issueRewards() {
    let decentralBank = await DecentralBank.deployed();

    await decentralBank.issueRewards();

    console.log('Tokens have been issued successfully');

    callback();
}