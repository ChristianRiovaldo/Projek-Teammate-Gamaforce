import React from "react";

// Membuat navigation bar
const Header = () => {
    return (
        <nav className="bg-white border-2 border-blue-950 text-blue-950 shadow-xl flex flex-row items-center w-full h-16 fixed left-0 top-0 z-50 p-4">
            <div className="flex flex-row justify-between items-center w-full">
                <div className="flex justify-center items-center ml-20">
                    <img src="./src/assets/Gamaforce.jpeg" alt="Logo Gamaforce" className="w-full h-12 p-0" />
                </div>
                <div className="flex flex-row justify-end items-center w-1/3 mr-20">
                    <div className="pl-2 pr-2">
                        <input type="search" name="cari" id="Cari" className="text-black border-2 border-blue-950 rounded-lg px-4"/>
                    </div>
                    <div className="flex items-center border-2 border-blue-950 rounded-md pl-2 pr-2">
                        <button className="">Cari</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header