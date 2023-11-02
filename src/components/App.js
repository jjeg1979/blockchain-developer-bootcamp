import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// Library to talk to the blockchain
import config from '../config.json';


import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
} from '../store/interactions';


function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {

    // Connect Ethers to Blockchain
    const provider = await loadProvider(dispatch);

    // Fetch current network's chainID (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Fetch current account & balance from Metamask
    await loadAccount(provider, dispatch);

    // Load token smart contracts
    const DApp = config[chainId].DApp;
    const mETH = config[chainId].mETH;
    // const mDAI = config[chainId].mDAI;
    await loadTokens(provider, [DApp.address, mETH.address], dispatch);

    // load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    await loadExchange(provider, exchangeConfig.address, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });


  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
