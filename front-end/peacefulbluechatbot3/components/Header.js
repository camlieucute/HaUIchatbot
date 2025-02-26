import React from 'react';
import Link from 'next/link'; // Use Next.js Link

const Header = () => {
    return (
        <header>
            <nav>
                <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold text-lg p-2 rounded-md transition duration-200 bg-blue-100 hover:bg-blue-200">Home</Link> {/* Styled Home link */}
                {/* Add other navigation links here if needed */}
            </nav>
        </header>
    );
};

export default Header;
