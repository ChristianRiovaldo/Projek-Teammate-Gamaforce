import React from "react";
import { useState } from "react";

const MenuComponent = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <button
                onClick={toggleMenu}
                className="absolute bg-red-600 px-4 py-2 text-white rounded-xl z-50 top-[85%] left-[45%]">
                Create Mission
            </button>

            {isMenuOpen && (
                <div className="absolute bg-black flex flex-row gap-2 top-[30%] left-[35%]">
                    <div className=" bg-white bg-opacity-80 flex flex-col text-black rounded-lg p-4 w-72 z-50 h-fit gap-2">
                        <h3 className="font-bold text-lg">Mission Options</h3>

                        <div className="flex flex-row gap-1">
                            <input type="text" placeholder="Nama misi..." className="border-2 border-blue-950 rounded-md"/>
                            <><button className="bg-blue-950 text-white rounded-md px-2">Create</button></>
                        </div>

                        <button onClick={toggleMenu} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Close</button>
                    </div>

                    <div className=" bg-white bg-opacity-80 text-black rounded-lg p-4 w-72 z-50 h-fit">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque amet, earum quos nemo inventore quod quam molestiae veritatis vel nihil?</p>
                    </div>

                </div>
            )};
        </div>

    );
};

export default MenuComponent;