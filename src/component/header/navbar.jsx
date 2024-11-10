import React from "react";
import { useState } from "react";
import { Search } from 'lucide-react';

const Header = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <nav className="bg-white border-b-2 border-blue-950 text-blue-950 shadow-md fixed w-full h-16 z-20 p-4 flex items-center">
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                
                {/* Logo */}
                <div className="flex-shrink-0">
                    <img
                        src="./src/assets/Gamaforce.jpeg"
                        alt="Logo Gamaforce"
                        className="h-10 w-auto"
                    />
                </div>
                
                {/* Search bar untuk layar besar */}
                <div className="hidden sm:flex w-full max-w-sm items-center space-x-2">
                    <input
                        type="search"
                        placeholder="Cari..."
                        className="w-full text-black border-2 border-blue-950 rounded-lg px-4 py-1 focus:outline-none"
                    />
                    <button className="bg-blue-950 text-white rounded-md px-4 py-1">
                        Cari
                    </button>
                </div>

                {/* Menu icon untuk layar kecil */}
                <div className="flex sm:hidden">
                    <button onClick={toggleSearch} className="text-blue-950 mx-4">
                        {/* Icon untuk menu mobile */}
                        < Search />
                    </button>
                </div>

                {/* Search bar untuk mobile */}
                {isSearchVisible && (
                    <div
                        className={`absolute top-16 left-0 w-full px-4 py-2 transition-transform duration-1000 ease-in-out ${
                            isSearchVisible ? "translate-y-0" : "-translate-y-full"
                        }`}
                        style={{ transformOrigin: "top" }}
                    >
                        <input
                            type="search"
                            name="cari"
                            id="CariMobile"
                            className="w-full text-black border-2 border-blue-950 rounded-lg px-4 py-1 focus:outline-none"
                            placeholder="Cari..."
                        />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
