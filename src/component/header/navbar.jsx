import React from "react";


// Membuat navigation bar
const Header = () => {
    return (
        <nav className="bg-white border-2 border-blue-950 text-blue-950 w-full h-16 fixed left-0 top-0 z-50">
            <div className="flex flex-row justify-between items-center shadow-xl p-4">
                <div className="ml-20">
                    <p>UNTUK LOGO</p>
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