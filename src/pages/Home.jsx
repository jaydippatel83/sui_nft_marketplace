const Home = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Welcome to the Sui NFT Marketplace</h1>
            <p className="text-lg mb-4">Discover, collect, and sell extraordinary NFTs on the Sui blockchain.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2">Featured NFT</h2>
                    <img src="https://via.placeholder.com/300" alt="Featured NFT" className="w-full h-auto rounded-md mb-4" />
                    <p className="text-gray-400">This is a featured NFT. It can be anything from a digital painting to a collectible item.</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">View Details</button>
                </div>
            </div>
        </div>
    );
};

export default Home;