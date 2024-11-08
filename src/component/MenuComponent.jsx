import React, { useState } from "react";

const MenuComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <button
                onClick={toggleMenu}
                className="absolute bg-red-600 text-white rounded-xl shadow-md w-auto px-4 py-2 z-50 top-[85%] left-[30%] sm:left-[40%] md:left-[40%] lg:left-[45%]"
            >
                Create Mission
            </button>

            {isMenuOpen && (
                <div className="absolute flex flex-col sm:flex-row top-[25%] left-[25%] sm:left-[20%] md:left-[25%] lg:top-[27%] lg:left-[35%] h-1/3 z-50 gap-2">
                    {/* Menu Create Mission */}
                    <div className="bg-white bg-opacity-80 border-2 border-red-800  flex flex-col justify-evenly text-black rounded-lg shadow-lg p-4 w-full max-w-60 sm:w-72 sm:h-full gap-2">
                        <h3 className="font-bold text-lg">Mission Options</h3>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                type="text"
                                placeholder="Nama misi..."
                                className="border-2 border-blue-950 rounded-md w-full"
                            />
                            <button className="bg-blue-950 text-white rounded-lg px-4 py-2 w-full sm:w-auto">
                                Create
                            </button>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Close
                        </button>
                    </div>

                    {/* Konten Tambahan */}
                    <div className="bg-white bg-opacity-80 border-2 border-red-800  text-black rounded-lg shadow-lg p-4 w-full max-w-60 h-36 sm:w-72 sm:h-full">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aliquid nisi aperiam velit
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuComponent;
