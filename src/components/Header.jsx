import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">Sui NFT Marketplace</Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                        <li><Link to="/explore" className="hover:text-gray-300">Explore</Link></li>
                        <li><Link to="/create" className="hover:text-gray-300">Create</Link></li>
                        <li><Link to="/profile" className="hover:text-gray-300">Profile</Link></li>
                    </ul>
                </nav>
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Connect Wallet</button>
            </div>
        </header>
    );
};

export default Header;