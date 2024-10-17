import { useState, useEffect } from 'react'; 
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

const Profile = () => {
    const currentAccount = useCurrentAccount(); 
    const [loading, setLoading] = useState(true);

    const packageId = import.meta.env.VITE_PACKAGE_ID;

    const { data: nftsResponse, error, isSuccess } = useSuiClientQuery('getOwnedObjects', {
        owner: currentAccount?.address,
        filter: { Package: packageId },
        options: { showContent: true },
    }, {
        enabled: !!currentAccount?.address,
    });

    useEffect(() => {
        if (isSuccess || error) {
            setLoading(false);
        }
    }, [isSuccess, error]); 

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
                        </div>
                    ))}
                </div>
            ) : (
                <p>You don&apos;t own any NFTs yet.</p>
            )}
        </div>
    );
};

export default Profile;