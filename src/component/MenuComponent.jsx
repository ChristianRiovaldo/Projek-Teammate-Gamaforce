import React from "react";

const MenuComponent = () => {
    return (
        <div className="relative w-full h-screen bg-transparent">
            <button className="absolute bg-red-600 px-4 py-2 text-white rounded-md z-50 top-[100%] left-[45%]">Create Mission</button>
        </div>
    );
};

export default MenuComponent;