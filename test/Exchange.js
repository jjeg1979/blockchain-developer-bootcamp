const { expect } = require('chai');
const { ethers } = require('hardhat');


const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
    let deployer, feeAccount, exchange;

    const feePercent = 10;

    // Fixture to use along the code
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];

        const Exchange = await ethers.getContractFactory('Exchange');
        exchange = await Exchange.deploy(feeAccount.address, feePercent);
    })

    // Describe Deployment
    describe('Deployment', () => {

        beforeEach(async () => {

        });

        it('tracks the fee account', async () => {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address);
        });

        it('tracks the fee percent', async () => {
            expect(await exchange.feePercent()).to.equal(feePercent);
        });
    });
});
