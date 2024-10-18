import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import { toast } from 'react-toastify';

const Profile = () => {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();
    const [loading, setLoading] = useState(true);
    const [listingNFT, setListingNFT] = useState(null);
    const [listingPrice, setListingPrice] = useState('');

    const { mutate: signAndExecute } = useSignAndExecuteTransaction({
        execute: async ({ bytes, signature }) =>
            await suiClient.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showRawEffects: true,
                    showEffects: true,
                },
            }),
    });


    const packageId = import.meta.env.VITE_PACKAGE_ID;
    const marketplaceId = import.meta.env.VITE_MARKETPLACE_ID; // Make sure this is set in your .env file

    const { data: nftsResponse, error, isSuccess, refetch } = useSuiClientQuery('getOwnedObjects', {
        owner: currentAccount?.address,
        filter: { Package: packageId },
        options: { showContent: true },
    }, {
        enabled: !!currentAccount?.address,
    });


    const { data: listedNFTs, refetch: refetchListings } = useSuiClientQuery('getDynamicFields', {
        parentId: marketplaceId,
    }, {
        enabled: !!marketplaceId,
    });

    const isNFTListed = (nftId) => {
        return listedNFTs?.data?.some(item => item.name.value === nftId);
    };


    useEffect(() => {
        if (isSuccess || error) {
            setLoading(false);
        }
    }, [isSuccess, error]);

    const handleListNFT = (nft) => {
        setListingNFT(nft);
    };

    const handleListingSubmit = async (e) => {
        e.preventDefault();
        // Add these checks before creating the transaction
        if (!currentAccount) {
            toast.error("Wallet not connected");
            return;
        }

        // Check if the NFT is owned by the current account
        const isOwned = nftsResponse?.data?.some(nft => nft.data.objectId === listingNFT.data.objectId);
        if (!isOwned) {
            toast.error("You don't own this NFT");
            return;
        }

        // Check if the marketplace object exists
        if (!marketplaceId) {
            toast.error("Marketplace not found");
            return;
        }
        if (!listingNFT || !listingPrice) return;
        const price = parseInt(listingPrice);
        if (isNaN(price) || price <= 0) {
            toast.error("Please enter a valid positive price");
            return;
        }
        try {
            const tx = new Transaction();
            tx.moveCall({
                target: `${packageId}::nft_contract::list_nft_entry`,
                arguments: [
                    tx.object(marketplaceId),
                    tx.object(listingNFT.data.objectId), 
                    tx.pure.u64(price), 
                ],
            }); 
            tx.setGasBudget(20000000);

            const result = await signAndExecute(
                {
                    transaction: tx, 
                },
                {
                    onSuccess: (result) => { 
                        console.log('Transaction result:', result);
                        if (result.effects?.status?.status === "success") {
                            console.log('NFT listed successfully:', result);
                            toast.success('NFT listed successfully');
                            setListingNFT(null);
                            setListingPrice('');
                            refetch();
                            refetchListings();
                        } else {
                            console.error('Transaction failed:', result.effects?.status);
                            toast.error(`Transaction failed: ${result.effects?.status?.error || 'Unknown error'}`);
                        }
                    },
                    onError: (error) => { 
                        console.error('Transaction execution failed:', error);
                        toast.error(`Error executing transaction: ${error.message}`);
                    },
                }
            );
            console.log('Transaction result:', result);
            setListingNFT(null);
            setListingPrice('');
            refetch();
            refetchListings();
        } catch (error) {
            toast.error('Error listing NFT:', error);
        }
    };

    if (!currentAccount) {
        return <div className="text-center mt-10">Please connect your wallet to view your profile.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">Wallet Address</h2>
                <p className="font-mono">{currentAccount.address}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
        {loading ? (
            <p>Loading your NFTs...</p>
        ) : error ? (
            <p>Error: {error.message}</p>
        ) : nftsResponse && nftsResponse.data && nftsResponse.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nftsResponse.data.map((nft) => (
                    <div key={nft.data.objectId} className="bg-white rounded-lg shadow-md p-4">
                        <img
                            src={nft.data.content.fields.url}
                            alt={nft.data.content.fields.name}
                            className="w-full h-48 object-cover rounded-md mb-2"
                        />
                        <h3 className="text-lg font-semibold">{nft.data.content.fields.name}</h3>
                        <p className="text-sm text-gray-600">{nft.data.content.fields.description}</p>
                        {isNFTListed(nft.data.objectId) ? (
                            <p className="mt-2 text-sm text-yellow-600 font-semibold">Already Listed</p>
                        ) : (
                            <button
                                onClick={() => handleListNFT(nft)}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                List for Sale
                            </button>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p>You don&apos;t own any NFTs yet.</p>
        )}

            {listingNFT && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold mb-4">List NFT for Sale</h3>
                        <form onSubmit={handleListingSubmit}>
                            <input
                                type="number"
                                value={listingPrice}
                                onChange={(e) => setListingPrice(e.target.value)}
                                placeholder="Enter price in SUI"
                                className="w-full p-2 mb-4 border rounded"
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setListingNFT(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    List NFT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;