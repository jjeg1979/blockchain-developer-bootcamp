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
  subscribeToEvents,
} from '../store/interactions';

import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {

    // Connect Ethers to Blockchain
    const provider = await loadProvider(dispatch);

    // Fetch current network's chainID (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when network is changed
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch);
    });

    // Load token smart contracts
    const DApp = config[chainId].DApp;
    const mETH = config[chainId].mETH;

    await loadTokens(provider, [DApp.address, mETH.address], dispatch);

    // load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch);

    // Listen to events
    subscribeToEvents(exchange, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });


  return (
    <div>

      {/* Navbar */}

      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}
          <Markets />

          {/* Balance */}
          <Balance />

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
