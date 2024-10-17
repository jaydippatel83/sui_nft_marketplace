import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Sui NFT Marketplace</h3>
                        <p className="text-gray-400">Mint, collect, and sell extraordinary NFTs on the Sui blockchain.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Marketplace</h4>
                        <ul className="space-y-2">
                            <li><Link to="/explore" className="text-gray-400 hover:text-white">Explore</Link></li>
                            <li><Link to="/create" className="text-gray-400 hover:text-white">Create</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Community</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Discord</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Telegram</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                            <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2023 Sui NFT Marketplace. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;