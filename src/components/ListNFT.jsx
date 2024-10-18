import React, { useState, useEffect } from 'react';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import { toast } from 'react-toastify';

const ListNFT = ({ marketplaceId, onListingSuccess }) => {
  const [nftId, setNftId] = useState('');
  const [price, setPrice] = useState('');
  const [listedNFTs, setListedNFTs] = useState([]);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const fetchListedNFTs = async () => {
    try {
      const txb = new Transaction();
      txb.moveCall({
        target: `${import.meta.env.VITE_PACKAGE_ID}::marketplace::get_listings`,
        arguments: [txb.object(marketplaceId)],
      });
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: '0x0', // Use a dummy address for read-only calls
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
  }, [marketplaceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const txb = new Transaction();
    txb.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::nft_contract::list_nft_entry`,
      arguments: [
        txb.object(marketplaceId),
        txb.object(nftId),
        txb.pure.u64(parseInt(price)),
      ],
    });

    try {
      await signAndExecute({
        transaction: txb,
      });
      toast.success('NFT listed successfully');
      setNftId('');
      setPrice('');
      fetchListedNFTs();
      onListingSuccess();
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  };

  console.log(listedNFTs);
  

  return (
    <div>
      <h2>List Your NFT</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
          placeholder="NFT ID"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price in SUI"
          required
        />
        <button type="submit">List NFT</button>
      </form>

      <h2>Currently Listed NFTs</h2>
      <ul>
        {listedNFTs.map((nft) => (
          <li key={nft.id}>
            NFT ID: {nft.id}, Price: {nft.price} SUI
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListNFT;