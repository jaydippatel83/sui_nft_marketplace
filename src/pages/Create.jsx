import { useState } from 'react';
import { toast } from 'react-toastify';
import { create } from 'ipfs-http-client';
import { useCurrentAccount, useSuiClient,  useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
  

let ipfs;
try {
    ipfs = create({
        url: import.meta.env.VITE_IPFS_URL,
        headers: {
            Authorization: 'Basic ' + btoa(import.meta.env.VITE_IPFS_PROJECT_ID + ':' + import.meta.env.VITE_IPFS_PROJECT_SECRET)
        }
    });
} catch (error) {
    console.error("IPFS client creation failed", error);
    ipfs = undefined;
}

const Create = () => {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();
    const nftPackageId = import.meta.env.VITE_PACKAGE_ID;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadToIPFS = async (file) => {
        try {
            const added = await ipfs.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setImageUrl(url);
            return url;
        } catch (error) {
            console.error('Error uploading file: ', error);
            toast.error('Error uploading file to IPFS');
        }
    };  

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (!imageFile) {
            toast.error('Please select an image file');
            return;
        }
        if (!currentAccount) {
            toast.error('Please connect your wallet first');
            return;
        }
        setIsLoading(true);
        try {
            const url = await uploadToIPFS(imageFile);
            if (!url) {
                setIsLoading(false);
                return;
            }

            if (!name || !description || !url) {
                console.error('One or more required fields are missing');
                toast.error('Please fill all fields correctly');
                return;
            }
            
            const tx = new Transaction();

            tx.moveCall({
                target: `${nftPackageId}::nft_contract::mint_nft`,
                arguments: [
                    tx.pure.string(name),
                    tx.pure.string(description),
                    tx.pure.string(url),
                ],
            });

            console.log('Signing and executing transaction...');
            const result = await signAndExecute(
                {
                    transaction: tx, 
                },
                {
                    onSuccess: (result) => {
                        const objectId = result.effects?.created?.[0]?.reference?.objectId;
                        console.log('NFT minted successfully:', objectId);
                        toast.success(`NFT minted successfully: ${objectId}`);
                    },
                    onError: (error) => {
                        console.error('Transaction execution failed:', error);
                        toast.error(`Error executing transaction: ${error.message}`);
                    },
                    onSigned: () => {
                        console.log('Transaction signed, waiting for execution...');
                        toast.info('Transaction signed, waiting for execution...');
                    }
                }
            );
console.log(result,"result");

            setName('');
            setDescription('');
            setImageFile(null);
            setImageUrl('');
        } catch (error) {
            console.error('Error details:', error);
            toast.error('Error minting NFT: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="container mx-auto p-8 bg-white rounded-lg shadow-md max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Create NFT</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 font-medium">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2 font-medium">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="imageFile" className="block mb-2 font-medium">Image File:</label>
                        <input
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                    {imageUrl && (
                        <div className="mb-4">
                            <p className="font-medium">Preview:</p>
                            <img src={imageUrl} alt="Preview" className="mt-2 max-w-full h-auto" />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Minting...
                            </>
                        ) : (
                            'Mint NFT'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;