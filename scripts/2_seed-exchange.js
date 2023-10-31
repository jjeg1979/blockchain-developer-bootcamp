// Only if run with node
// const hre = require("hardhat");
// const { ethers } = require("hardhat");

// import config file
const config = require('../src/config.json');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

async function main() {
    // Fetch acounts
    const accounts = await ethers.getSigners();

    // Fetch network
    const { chainId } = await ethers.provider.getNetwork();
    console.log(`Using chainId: ${chainId}\n`);

    // Fetch deployed tokens
    const Dapp = await ethers.getContractAt('Token', config[chainId].DApp.address);
    console.log(`Dapp Token fetched: ${Dapp.address}\n`);

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address);
    console.log(`mETH Token fetched: ${mETH.address}\n`);

    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address);
    console.log(`mDAI Token fetched: ${mDAI.address}\n`);

    // Fetch deployed exchange
    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address);
    console.log(`Exchange fetched: ${exchange.address}\n`);

    // Give tokens to account[1]
    const sender = accounts[0];
    const receiver = accounts[1];
    let amount = tokens(10000);

    // User1 transfers 10,000 mETH...
    let transaction, result;
    transaction = await mETH.connect(sender).transfer(receiver.address, amount);
    console.log(`Transferring ${amount} tokens from ${sender.address} to ${receiver.address}\n`);

    // Setup exchange users
    const user1 = accounts[0];
    const user2 = accounts[1];
    amount = tokens(10000);

    // user1 approves 10,000 Dapp...
    transaction = await Dapp.connect(user1).approve(exchange.address, amount);
    await transaction.wait();
    console.log(`Approved ${amount} tokens from ${user1.address}\n`);

    // user1 depostis 10,000 Dapp...
    transaction = await exchange.connect(user1).depositToken(Dapp.address, amount);
    await transaction.wait();
    console.log(`Deposited ${amount} Dapp from ${user1.address}\n`);

    // user2 approves 10,000 mETH...
    transaction = await mETH.connect(user2).approve(exchange.address, amount);
    await transaction.wait();
    console.log(`Approved ${amount} tokens from ${user2.address}\n`);

    // user2 deposits 10,000 mETH...
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount);
    await transaction.wait();
    console.log(`Deposited ${amount} mETH from ${user2.address}\n`);

    // ------------------------------------------------
    // Seed a Cancelled Order
    // ------------------------------------------------

    // user1 makes order to get tokens
    let orderId;
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Dapp.address, tokens(5));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}\n`);

    // user1 cancels order
    orderId = result.events[0].args.id;
    transaction = await exchange.connect(user1).cancelOrder(orderId);
    result = await transaction.wait();
    console.log(`Cancelled order with id ${orderId} from ${user1.address}\n`);

    // Wait 1 second
    await wait(1);

    // ------------------------------------------------
    // Seed Filled Orders (Trades)
    // ------------------------------------------------
    // user1 makes order to get tokens
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Dapp.address, tokens(10));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}\n`);

    // user2 fills the order
    orderId = result.events[0].args.id;
    transaction = await exchange.connect(user2).fillOrder(orderId);
    result = await transaction.wait();
    console.log(`${user2.address} filled order with id ${orderId} from ${user1.address}\n`);

    // Wait 1 second
    await wait(1);

    // user 1 makes another order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), Dapp.address, tokens(15));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}\n`);

    // user2 fills another order
    orderId = result.events[0].args.id;
    transaction = await exchange.connect(user2).fillOrder(orderId);
    result = await transaction.wait();
    console.log(`${user2.address} filled order with id ${orderId} from ${user1.address}\n`);

    // Wait 1 second
    await wait(1);

    // user1 makes final order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), Dapp.address, tokens(20));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}\n`);

    // user2 fills final order
    orderId = result.events[0].args.id;
    transaction = await exchange.connect(user2).fillOrder(orderId);
    result = await transaction.wait();
    console.log(`${user2.address} filled order with id ${orderId} from ${user1.address}\n`);

    // Wait 1 scond
    await wait(1);

    // ------------------------------------------------
    // Seed Open Orders
    // ------------------------------------------------

    // User 1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * 1), Dapp.address, tokens(10));
        result = await transaction.wait();
        console.log(`Made order from ${user1.address}`);

        // Wait 1 second
        await wait(1);
    }
    console.log('\n');
    // User 2 makes 10 orders
    for (let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user2).makeOrder(Dapp.address, tokens(10), mETH.address, tokens(10 * i));
        result = await transaction.wait();
        console.log(`Made order from ${user2.address}`);

        // Wait 1 second
        await wait(1);
    }
    console.log('\n')
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
