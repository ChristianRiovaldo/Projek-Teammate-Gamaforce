
import React from "react";

const Header = () => {
    return (
        <nav className="bg-gray-600 text-white w-full h-16 fixed left-0 top-0 z-0">
            
            <div className="flex flex-row justify-between items-center p-4">

                <div className="ml-20">
                    <img src="logoGamaforce.jpg" alt="Logo" className="h-9 mr-2"/>
                </div>

                <div className="flex flex-row justify-end w-1/3 mr-20">

                    <div className="pr-2">
                        <input type="search" name="cari" id="Cari" className="rounded-xl"/>
                    </div>

                    <div className="pl-2">
                        <button id="tombol" className="font-bold">cari misi</button>
                    </div>

                </div>

            </div>
        </nav>
    );
}

export default Header
