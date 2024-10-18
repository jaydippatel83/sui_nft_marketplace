import React from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";

const CancelListing = ({ marketplaceId, nftId }) => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleCancel = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::nft_contract::cancel_listing_entry`,
      arguments: [
        tx.object(marketplaceId),
        tx.object(nftId),
      ],
    });

    try {
      await signAndExecute({
        transaction: tx,
      });
      console.log('Listing canceled successfully');
      // Show success message or update UI
    } catch (error) {
      console.error('Error canceling listing:', error);
    }
  };

  return (
    <button onClick={handleCancel}>Cancel Listing</button>
  );
};

export default CancelListing;