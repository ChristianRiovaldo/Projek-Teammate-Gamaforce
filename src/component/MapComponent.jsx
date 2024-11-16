import L from 'leaflet';
import { Hexagon, Circle, PencilLine, MapPin, Edit } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import MenuComponent from './MenuComponent';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const MapComponent = forwardRef((props, ref) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [polygonPoints, setPolygonPoints] = useState([]);
    const [polylinePoints, setPolylinePoints] = useState([]);
    const [rectangleBounds, setRectangleBounds] = useState(null);
    const [circleData, setCircleData] = useState(null);
    const [markerPosition, setMarkerPosition] = useState({ lat: '', lng: '' });
    const [showPopover, setShowPopover] = useState(false);
    const drawnItems = useRef(new L.FeatureGroup());
    const [isEditing, setIsEditing] = useState(false);
    const [createdShapes, setCreatedShapes] = useState([]);
    const [createdMission, setCreatedMission] = useState(null); // State untuk nama misi yang dibuat
    const [missionList, setMissionList] = useState([]);
    const [missionShapes, setMissionShapes] = useState([]);
    const [currentMission, setCurrentMission] = useState(null);
    const [isSatelliteView, setIsSatelliteView] = useState(false);

    // Modify the loadMissionShapes function to update the current mission
    const loadMissionShapes = async (missionName) => {
        console.log("loadMissionShapes called with:", missionName);
        try {
            const response = await fetch(`http://localhost:3000/api/shapes/${missionName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mission data');
            }
            const missionData = await response.json();
            console.log("Received mission data:", JSON.stringify(missionData, null, 2));
    
            if (!mapInstance.current) {
                console.error("Map instance is not initialized");
                return;
            }
    
            // Clear existing layers
            mapInstance.current.eachLayer((layer) => {
                if (!(layer instanceof L.TileLayer)) {
                    mapInstance.current.removeLayer(layer);
                }
            });
    
            let allBounds = [];
    
            missionData.forEach((shape, index) => {
                console.log(`Processing shape ${index}:`, JSON.stringify(shape, null, 2));
                let layer;
                try {
                    // Parse coordinates if they're a string
                    let coordinates = shape.coordinates;
                    if (typeof coordinates === 'string') {
                        try {
                            coordinates = JSON.parse(coordinates);
                        } catch (parseError) {
                            console.error(`Error parsing coordinates for shape ${index}:`, parseError);
                            return;
                        }
                    }
    
                    // Parse center if it's a string
                    let center = shape.center;
                    if (typeof center === 'string') {
                        try {
                            center = JSON.parse(center);
                        } catch (parseError) {
                            console.error(`Error parsing center for shape ${index}:`, parseError);
                            return;
                        }
                    }
    
                    switch (shape.type) {
                        case 'polygon':
                            if (coordinates && Array.isArray(coordinates) && coordinates.length >= 3) {
                                if (coordinates.every(coord => Array.isArray(coord) && coord.length === 2)) {
                                    layer = L.polygon(coordinates, { color: 'blue' });
                                } else {
                                    console.error(`Invalid polygon coordinates for shape ${index}:`, coordinates);
                                }
                            } else {
                                console.error(`Invalid polygon data for shape ${index}:`, shape);
                            }
                            break;
                        case 'polyline':
                            if (coordinates && Array.isArray(coordinates) && coordinates.length >= 2) {
                                if (coordinates.every(coord => Array.isArray(coord) && coord.length === 2)) {
                                    layer = L.polyline(coordinates, { color: 'red' });
                                } else {
                                    console.error(`Invalid polyline coordinates for shape ${index}:`, coordinates);
                                }
                            } else {
                                console.error(`Invalid polyline data for shape ${index}:`, shape);
                            }
                            break;
                        case 'circle':
                            if (center && Array.isArray(center) && center.length === 2 && typeof shape.radius === 'number') {
                                layer = L.circle(center, { radius: shape.radius, color: 'green' });
                            } else {
                                console.error(`Invalid circle data for shape ${index}:`, shape);
                            }
                            break;
                        case 'marker':
                            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
                                layer = L.marker(coordinates);
                            } else {
                                console.error(`Invalid marker coordinates for shape ${index}:`, coordinates);
                            }
                            break;
                        default:
                            console.warn(`Unknown shape type for shape ${index}:`, shape.type);
                            return;
                    }
    
                    if (layer) {
                        layer.addTo(mapInstance.current);
                        console.log(`Added ${shape.type} to map`);
                        if (layer.getBounds) {
                            allBounds.push(layer.getBounds());
                        } else if (layer.getLatLng) {
                            allBounds.push(L.latLngBounds(layer.getLatLng(), layer.getLatLng()));
                        }
                    }
                } catch (shapeError) {
                    console.error(`Error processing shape ${index}:`, shapeError);
                }
            });
    
            if (allBounds.length > 0) {
                const bounds = L.latLngBounds(allBounds);
                if (bounds.isValid()) {
                    mapInstance.current.fitBounds(bounds);
                } else {
                    console.warn("Invalid bounds, setting default view");
                    mapInstance.current.setView([0, 0], 2);
                }
            } else {
                console.warn("No valid layers to display");
                mapInstance.current.setView([0, 0], 2);
            }
    
            setCurrentMission(missionName);
            console.log(`Mission "${missionName}" loaded successfully!`);
        } catch (error) {
            console.error('Error loading mission:', error);
            alert('Failed to load mission. Please try again.');
        }
    };      

    useImperativeHandle(ref, () => ({
        loadMissionShapes
    }));

    // Fungsi untuk menyimpan data
    const saveShape = async (shapeData) => {
        try {
            const response = await fetch('http://localhost:3000/api/shapes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shapeData)
            });

            if (!response.ok) {
                throw new Error('Failed to save shape');
            }
            const savedShape = await response.json();
            console.log('Shape saved:', savedShape);

            setMissionShapes((prevShapes) => {
                const updatedShapes = { ...prevShapes };
                if (!updatedShapes[shapeData.missionName]) {
                    updatedShapes[shapeData.missionName] = [];
                }
                updatedShapes[shapeData.missionName].push(shapeData);
                return updatedShapes;
            });
        } catch (error) {
            console.error('Error saving shape:', error);
        }
    };
    
    // Fungsi mengirim data ke backend
    const handleSaveShapes = async (missionName) => {
        if(missionName.trim()) {
            try {
                for (const shape of createdShapes) {
                    const shapeData = { ...shape, missionName };
                    await saveShape(shapeData);
                }
                setCreatedShapes([]); // Kosongkan state setelah data disimpan
                alert('All shapes have been saved successfully!');
            } catch (error) {
                console.error('Error saving shapes:', error);
                alert('Failed to save some shapes. Please try again.');
            }
        }
        else {
            alert("Please enter a valid mission name.");
        }
    };

    const onCreateMission = (missionName) => {
        if (!missionName) {
            alert("Please enter a mission name");
            return;
        }
        setCreatedMission(missionName);
        handleSaveShapes(missionName);

        // Add the mission to the mission list
        setMissionList((prevList) => {
            const updatedList = [...prevList, missionName];
            return updatedList;
        });
        console.log("Mission Created:", missionName);
    };
    
    const fetchMissionList = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/shapes');
            if (!response.ok) {
                throw new Error('Failed to fetch missions');
            }
            const missions = await response.json();
            setMissionList(missions); // Simpan daftar misi di state
        } catch (error) {
            console.error('Error fetching mission list:', error);
        }
    };
    
    // Panggil fungsi saat komponen dimuat
    useEffect(() => {
        fetchMissionList();
    }, []);

    const handleLoadMission = (missionData) => {
        // Reset peta sebelum menggambar ulang
        mapInstance.current.eachLayer((layer) => {
            if (!(layer instanceof L.TileLayer)) {
                mapInstance.current.removeLayer(layer);
            }
        });
    
        // Iterasi melalui data bentuk dari misi
        missionData.forEach((shape) => {
            let layer;
    
            if (shape.type === 'polygon') {
                layer = L.polygon(shape.coordinates, { color: 'blue' });
            } else if (shape.type === 'polyline') {
                layer = L.polyline(shape.coordinates, { color: 'black' });
            } else if (shape.type === 'circle') {
                const [lat, lng] = shape.center;
                layer = L.circle([lat, lng], {
                    radius: shape.radius,
                    color: 'red',
                    fillOpacity: 0.4,
                });
            } else if (shape.type === 'marker') {
                const [lat, lng] = shape.coordinates;
                layer = L.marker([lat, lng]);
            }
    
            if (layer) {
                layer.addTo(mapInstance.current); // Tambahkan layer ke peta
                drawnItems.current.addLayer(layer); // Tambahkan layer ke group
            }
        });
    
        console.log('Mission loaded:', missionData);
    };

    useEffect(() => {
        if (mapInstance.current) {
            const drawControl = new L.Control.Draw({
                draw: {
                    marker: true, // Pastikan marker diaktifkan
                },
                edit: {
                    featureGroup: drawnItems.current,
                },
            });
        }
        
        if (mapRef.current && !mapInstance.current) {
            // Initialize the map
            mapInstance.current = L.map(mapRef.current).setView(
                [-7.773179090390894, 110.37823736303379], 15
            );

            // Add tile layer
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstance.current);

            // Marker with popup
            const marker = L.marker([-7.773179090390894, 110.37823736303379]).addTo(mapInstance.current);
            marker.bindPopup("This is GAMAFORCE!").openPopup();

            // Event listener untuk menangkap bentuk yang dibuat
            mapInstance.current.on(L.Draw.Event.CREATED, (event) => {
                const layer = event.layer;
                drawnItems.current.addLayer(layer);
                let shapeData;

                if (event.layerType === 'polygon') {
                    const points = layer.getLatLngs()[0].map((point) => [point.lat, point.lng]);
                    shapeData = { 
                        missionName: createdMission, 
                        type: event.layerType,
                        coordinates: points 
                    };
                    setPolygonPoints(points);
                } 
                else if (event.layerType === 'polyline') {
                    const points = layer.getLatLngs().map((point) => [point.lat, point.lng]);
                    shapeData = { 
                        missionName: createdMission,
                        type: event.layerType,
                        coordinates: points 
                    };
                    setPolylinePoints(points);
                } 
                else if (event.layerType === 'circle') {
                    const center = layer.getLatLng();
                    const radius = layer.getRadius();
                    shapeData = { 
                        missionName: createdMission,
                        type: event.layerType,
                        center: [center.lat, center.lng], 
                        radius 
                    };
                    setCircleData({ center: [center.lat, center.lng], radius });
                } 
                else if (event.layerType === 'marker') {
                    const position = layer.getLatLng();
                    shapeData = { 
                        missionName: createdMission,
                        type: 'marker',
                        coordinates: [position.lat, position.lng] 
                    };
                    console.log('Marker detected:', shapeData); // Debug log
                    setMarkerPosition(position);
                }

                // Tambahkan data shapeData ke state createdShapes
                setCreatedShapes((prevShapes) => [...prevShapes, shapeData]);

                // Tambahkan layer ke peta
                layer.addTo(mapInstance.current);
            });
        }
    }, []);

    // Toggle popover visibility
    const togglePopover = () => {
        setShowPopover((prev) => !prev);
    };

    // Fungsi untuk toggle mode peta ke satelit
    const toggleSatelliteView = () => {
        if (!mapInstance.current) return;

        const map = mapInstance.current;

        // Hapus semua layer tile sebelumnya
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });

        if (!isSatelliteView) {
            // Tambahkan Esri World Imagery untuk satelit view
            L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
                {
                    attribution: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                }
            ).addTo(map);
        } else {
            // Kembalikan ke peta default
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);
        }

        setIsSatelliteView(!isSatelliteView); // Toggle state
    }

    // Fungsi untuk memulai mode menggambar poligon
    const handleDrawPolygon = () => {
        if (mapInstance.current) {
            const drawPolygon = new L.Draw.Polygon(mapInstance.current, {
                shapeOptions: {
                    color: 'blue',
                    weight: 2,
                    fillColor: '#3388ff',
                    fillOpacity: 0.4,
                }
            });
            drawPolygon.enable();
        }
    };

    // Fungsi untuk menggambar garis
    const handleDrawLine = () => {
        const drawLine = new L.Draw.Polyline(mapInstance.current, {
            shapeOptions: {
                color: 'black',
                weight: 2,
            }
        });
        drawLine.enable();
    };

    // Fungsi untuk menambahkan marker pada koordinat yang diinputkan
    const handleAddMarker = () => {
        const { lat, lng } = markerPosition;
        if (mapInstance.current && lat && lng) {
            const marker = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(mapInstance.current);
            marker.bindPopup(`Marker at [${lat}, ${lng}]`).openPopup();
            setShowPopover(false); // Tutup popover setelah menambahkan marker
        }
    };

    // Fungsi untuk mengupdate koordinat marker berdasarkan input
    const handleMarkerPositionChange = (e) => {
        const { name, value } = e.target;
        setMarkerPosition((prev) => ({ ...prev, [name]: value }));
    };

    // Fungsi untuk menggambar lingkaran
    const handleDrawCircle = () => {
        const drawCircle = new L.Draw.Circle(mapInstance.current, {
            shapeOptions: {
                color: 'red',
                weight: 2,
                fillColor: '#ff6666',
                fillOpacity: 0.4,
            }
        });
        drawCircle.enable();
    };

    // Toggle edit mode
    const handleEditMode = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            mapInstance.current.eachLayer((layer) => {
                if (drawnItems.current.hasLayer(layer) && layer.editing) {
                    layer.editing.disable();
                }
            });
        } else {
            drawnItems.current.eachLayer((layer) => {
                if (layer.editing) layer.editing.enable();
            });
        }
    }; 

    return (
        <div className='relative flex items-center'>
            
            {/* Create Mission Button */}
            <div className='absolute w-full h-screen bg-transparent'>
                    <MenuComponent 
                        onCreateMission={onCreateMission}
                        onLoadMission={(data) => handleLoadMission(data)}
                        />
                    <div>{createdMission && <p>Misi Dibuat: {createdMission}</p>}</div>
            </div>
            
            {/* Container untuk peta */}
            <div ref={mapRef} className="w-screen h-screen mt-16 z-0" style={{ width: "100%", height: "calc(100vh - 4rem)" }} />


            <div className='absolute left-2 top-52 lg:top-48 flex items-start z-10'>
                <div className="flex flex-col items-start gap-2 px-2 max-w-96 sm:max-w-md lg:max-w-lg">
                    <button
                        onClick={toggleSatelliteView}
                        className="px-4 py-2 bg-blue-950 border-2 border-white text-white rounded-xl shadow-md hover:bg-blue-700"
                    >
                        {isSatelliteView ? 'Default View' : 'Satellite View'}
                    </button>
                    
                    {/* Tombol Kustom untuk Memulai Mode Gambar */}
                    <button onClick={handleDrawPolygon} className="border-2 border-white px-2 py-2 bg-blue-950 text-white rounded-xl">
                        <Hexagon />
                    </button>

                    {/* Tombol Kustom untuk Memulai Mode Gambar */}
                    <button onClick={handleDrawLine} className="border-2 border-white px-2 py-2 bg-blue-950 text-white rounded-xl">
                        <PencilLine />
                    </button>

                    {/* Tombol Kustom untuk Memulai Mode Gambar */}
                    <button onClick={togglePopover} className="border-2 border-white px-2 py-2 bg-blue-950 text-white rounded-xl">
                        <MapPin />
                    </button>

                    {/* Popover untuk input koordinat */}
                    {showPopover && (
                        <div className="absolute left-16 p-4 bg-white bg-opacity-70 border rounded-lg shadow-lg w-48 z-20">
                            <h3 className="text-sm font-semibold mb-2">Set Marker Position</h3>
                            <input
                                type="text"
                                name="lat"
                                placeholder="Latitude"
                                value={markerPosition.lat}
                                onChange={handleMarkerPositionChange}
                                className="border-2 border-blue-950 px-2 py-1 mb-2 w-full rounded"
                            />
                            <input
                                type="text"
                                name="lng"
                                placeholder="Longitude"
                                value={markerPosition.lng}
                                onChange={handleMarkerPositionChange}
                                className="border-2 border-blue-950 px-2 py-1 mb-2 w-full rounded"
                            />
                            <button onClick={handleAddMarker} className="w-full border-2 border-blue-950 px-2 py-1 bg-blue-500 text-white rounded">
                                Add Marker
                            </button>
                        </div>
                    )}
                    
                    {/* Tombol Kustom untuk Memulai Mode Gambar */}
                    <button onClick={handleDrawCircle} className="border-2 border-white px-2 py-2 bg-blue-950 text-white rounded-xl">
                        <Circle />
                    </button>

                    {/* Button untuk editing */}
                    <button onClick={handleEditMode} className={`border-2 px-2 py-2 ${isEditing ? 'bg-green-500' : 'bg-blue-950'} text-white rounded-xl`}>
                        <Edit />
                    </button>

                </div>
            </div>
        </div>
    );
});

export default MapComponent;
