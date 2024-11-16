import { Radius } from "lucide-react";
import React, { useState, useEffect } from "react";

const MenuComponent = ({ onCreateMission, onSaveEdits, onEditMission }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [missionName, setMissionName] = useState(""); // State untuk nama misi
    const [missions, setMissions] = useState([]); // State untuk daftar misi

    // Mengambil daftar misi dari backend
    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/shapes");
                const data = await response.json();
                setMissions([...new Set(data.map((shape) => shape.name))]); // Mengupdate state missions dengan data dari backend
            } catch (error) {
                console.error("Error fetching missions:", error);
            }
        };

        fetchMissions();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCreateMission = () => {
        if (missionName.trim()) {
            onCreateMission(missionName); // Panggil function dari MapComponent untuk menyimpan shape
            setMissionName(""); // Reset input
            setIsMenuOpen(false); // Menutup menu setelah create
        } else {
            alert("Please enter a mission name.");
        }
    };

    // Fungsi untuk menghapus misi
    const handleDeleteMission = async (missionToDelete) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the mission "${missionToDelete}"?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/shapes/${missionToDelete}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete mission");
            }

            // Hapus misi dari daftar state missions
            setMissions((prevMissions) => prevMissions.filter((name) => name !== missionToDelete));
            alert(`Mission "${missionToDelete}" deleted successfully.`);
        } catch (error) {
            console.error("Error deleting mission:", error);
            alert("Failed to delete mission. Please try again.");
        }
    };

    const handleEditMission = async (missionName) => {
        console.log("Editing mission:", missionName);
        
        try {
            const response = await fetch(`http://localhost:3000/api/shapes/${missionName}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch shapes for the mission.");
            }

            const shapeData = await response.json();
            onEditMission(shapeData.shapes);
        } catch (error) {
            console.error("Error fetching shapes for mission:", error);
            alert("Failed to load shapes for the selected mission.");
        }
    };

    return (
        <div>
            <button
                onClick={toggleMenu}
                className="fixed bg-red-600 hover:bg-red-800 text-white rounded-xl shadow-md w-auto px-4 py-2 z-50 top-[85%] left-[30%] sm:left-[40%] md:left-[40%] lg:left-[45%]"
            >
                Mission Menu
            </button>

            {isMenuOpen && (
                <div className="absolute flex flex-col sm:flex-row top-[25%] left-[25%] sm:left-[20%] md:left-[25%] lg:top-[27%] lg:left-[35%] h-60 z-50 gap-2">
                    {/* Menu Create Mission */}
                    <div className="bg-white bg-opacity-80 border-2 border-red-800 flex flex-col justify-between text-black rounded-lg shadow-lg p-4 px-6 w-full max-w-60 sm:w-72 sm:h-full gap-2">
                        <h3 className="font-bold text-lg">Mission Options</h3>
                        <div className="flex flex-col gap-2 mt-[-5px] sm:mt-[-20px]">
                            <input
                                type="text"
                                placeholder="Nama misi..."
                                className="border-2 border-blue-950 rounded-md w-full px-2"
                                value={missionName}
                                onChange={(e) => setMissionName(e.target.value)} // Update nama misi
                            />
                            <div className="flex flex-row gap-2">
                                <button
                                    className="bg-blue-950 hover:bg-blue-700 text-white rounded-lg px-4 py-2 w-full sm:w-full"
                                    onClick={handleCreateMission}
                                >Create
                                </button>
                                <button
                                    className="bg-green-700 hover:bg-green-600 text-white rounded-lg px-4 py-2 w-full sm:w-full"
                                    onClick={onSaveEdits}
                                >Save
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >Close
                        </button>
                    </div>

                    {/* Konten Menampilkan Misi */}
                    <div className="bg-white bg-opacity-80 border-2 border-red-800  text-black rounded-lg shadow-lg p-4 w-full max-w-60 h-2/3 sm:w-72 sm:h-full">
                        <h3 className="font-bold text-lg">Mission List</h3>

                        {/* Menampilkan daftar misi yang diambil dari backend */}
                        {missions.length > 0 ? (
                            <ul className="list-decimal p-2 space-y-1 max-h-16 sm:max-h-40 overflow-y-auto text-sm text-left mb-2">
                                {missions.map((name, index) => (
                                    <li key={index} className="flex justify-between items-center font-semibold pb-2">
                                        {name}
                                        <button
                                            className=""
                                            onClick={() => handleDeleteMission(name)}
                                        >
                                            <i className="fas fa-trash text-white bg-red-600 hover:bg-red-800 rounded-md p-1 w-6 text-xs"></i>
                                        </button>
                                        <button
                                            className="bg-blue-950 hover:bg-yellow-800 text-white rounded-md px-2 py-1 text-sm"
                                            onClick={() => {
                                                console.log("Mission name on button click:", name);
                                                handleEditMission(name);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No missions created yet.</p>
                        )}

                    </div>
                </div>
            )}
        </div>

    );
};

export default MenuComponent;
