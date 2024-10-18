import { Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

const Header = () => {
    const currentAccount = useCurrentAccount();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLogout = () => { 
        console.log('Logout clicked');
    };
    
    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex justify-between items-center w-full sm:w-auto mb-4 sm:mb-0">
                    <Link to="/" className="text-2xl font-bold">Sui NFT Marketplace</Link>
                    <button className="sm:hidden bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Connect Wallet</button>
                </div>
                <nav className="w-full sm:w-auto mb-4 sm:mb-0">
                    <ul className="flex flex-wrap justify-center sm:space-x-6">
                        <li className="w-1/2 sm:w-auto mb-2 sm:mb-0"><Link to="/" className="hover:text-gray-300">Home</Link></li>
                        <li className="w-1/2 sm:w-auto mb-2 sm:mb-0"><Link to="/marketplace" className="hover:text-gray-300">Explore</Link></li>
                        <li className="w-1/2 sm:w-auto mb-2 sm:mb-0"><Link to="/create" className="hover:text-gray-300">Create</Link></li>
                        <li className="w-1/2 sm:w-auto mb-2 sm:mb-0"><Link to="/profile" className="hover:text-gray-300">Profile</Link></li>
                    </ul>
                </nav>
                {currentAccount ? (
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                        > 
                            <span>{currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}</span>
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ConnectButton />
                )}
            </div>
        </header>
    );
};

export default Header;