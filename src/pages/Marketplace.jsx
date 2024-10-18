import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import ListNFT from '../components/ListNFT';
import BuyNFT from '../components/BuyNFT';
import CancelListing from '../components/CancelListing';

const Marketplace = () => {
  const [listedNFTs, setListedNFTs] = useState([]);
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const marketplaceId = import.meta.env.VITE_MARKETPLACE_ID; // Make sure to set this in your .env file

  const fetchListedNFTs = async () => {
    try {
      const txb = new Transaction();
      txb.moveCall({
        target: `${marketplaceId}::marketplace::get_listings`,
        arguments: [txb.object(marketplaceId)],
      });
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: currentAccount?.address,
      });
      // Assuming the result contains the listed NFTs data
      const fetchedNFTs = result.results[0].returnValues[0];
      setListedNFTs(fetchedNFTs);
    } catch (error) {
      console.error('Error fetching listed NFTs:', error);
    }
  };

  useEffect(() => {
    fetchListedNFTs();
  }, [suiClient, currentAccount, marketplaceId]);

  const handleNewListing = () => {
    fetchListedNFTs();
  };

  console.log(listedNFTs,"listedNFTs");
  

  return (
    <div>
      <h1>NFT Marketplace</h1>
      <ListNFT marketplaceId={marketplaceId} onListingSuccess={handleNewListing} />
      <h2>Listed NFTs</h2>
      {listedNFTs.map((nft) => (
        <div key={nft.id}>
          <p>NFT ID: {nft.id}</p>
          <p>Price: {nft.price} SUI</p>
          {currentAccount?.address === nft.owner ? (
            <CancelListing marketplaceId={marketplaceId} nftId={nft.id} />
          ) : (
            <BuyNFT marketplaceId={marketplaceId} nftId={nft.id} price={nft.price} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Marketplace;