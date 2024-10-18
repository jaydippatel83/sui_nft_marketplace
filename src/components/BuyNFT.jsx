import React from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";

const BuyNFT = ({ marketplaceId, nftId, price }) => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleBuy = async () => {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(price)]);
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::nft_contract::buy_nft_entry`,
      arguments: [
        tx.object(marketplaceId),
        tx.object(nftId),
        coin,
      ],
    });

    try {
      await signAndExecute({
        transaction: tx,
      });
      console.log('NFT purchased successfully');
      // Show success message or update UI
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  return (
    <button onClick={handleBuy}>Buy NFT</button>
  );
};

export default BuyNFT;