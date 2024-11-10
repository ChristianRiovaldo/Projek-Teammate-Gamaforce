import L from 'leaflet';
import { Hexagon, Circle, PencilLine, MapPin, Edit, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MenuComponent from './MenuComponent';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const MapComponent = () => {
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
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
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

                if (event.layerType === 'polygon') {
                    const points = layer.getLatLngs()[0].map((point) => [point.lat, point.lng]);
                    setPolygonPoints(points);
                } else if (event.layerType === 'polyline') {
                    const points = layer.getLatLngs().map((point) => [point.lat, point.lng]);
                    setPolylinePoints(points);
                } else if (event.layerType === 'rectangle') {
                    const bounds = layer.getBounds();
                    setRectangleBounds({
                        southwest: [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                        northeast: [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
                    });
                } else if (event.layerType === 'circle') {
                    const center = layer.getLatLng();
                    const radius = layer.getRadius();
                    setCircleData({ center: [center.lat, center.lng], radius });
                }

                // Tambahkan layer ke peta
                layer.addTo(mapInstance.current);
            });
        }
    }, []);

    // Toggle popover visibility
    const togglePopover = () => {
        setShowPopover((prev) => !prev);
    };

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
        setIsDeleting(false);
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

    // Toggle delete mode
    const handleDeleteMode = () => {
        setIsDeleting(!isDeleting);
        setIsEditing(false);
        if (isDeleting) {
            drawnItems.current.eachLayer((layer) => {
                layer.on('click', () => {
                    drawnItems.current.removeLayer(layer);
                });
            });
        } else {
            drawnItems.current.eachLayer((layer) => {
                layer.off('click'); // Disable delete event listener
            });
        }
    };

    return (
        <div className='relative flex items-center'>
            {/* Create Mission Button */}
            <div className='absolute w-full h-screen bg-transparent'>
                    <MenuComponent/>
            </div>
            
            {/* Container untuk peta */}
            <div ref={mapRef} className="w-screen h-screen mt-16 z-0" style={{ width: "100%", height: "calc(100vh - 4rem)" }} />


            <div className='absolute left-0 top-52 lg:top-48 flex items-start z-10'>
                <div className="flex flex-col items-start gap-2 px-2 max-w-96 sm:max-w-md lg:max-w-lg">
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

                    {/* Button untuk menghapus */}
                    <button onClick={handleDeleteMode} className={`border-2 px-2 py-2 ${isDeleting ? 'bg-red-500' : 'bg-blue-950'} text-white rounded-xl`}>
                        <Trash2 />
                    </button>

                    {/* Jika ingin Menampilkan atau menyimpan misi */}
                    {/* <div className="border-2 border-blue-950 bg-white p-4 rounded-md max-h-36 overflow-y-auto max-w-34">
                        <h3>Selected Polygon:</h3>
                        <pre>{JSON.stringify(polygonPoints, null, 2)}</pre>
                    </div>
                    <div className="border-2 border-blue-950 bg-white p-4 rounded-md max-h-36 overflow-y-auto max-w-34">
                        <h3>Selected Polyline:</h3>
                        <pre>{JSON.stringify(polylinePoints, null, 2)}</pre>
                    </div>
                    <div className="border-2 border-blue-950 bg-white p-4 rounded-md max-h-36 overflow-y-auto max-w-34">
                        <h3>Selected Circle:</h3>
                        <pre>{JSON.stringify(circleData, null, 2)}</pre>
                    </div>
                    <div className="border-2 border-blue-950 bg-white p-4 rounded-md max-h-36 overflow-y-auto max-w-34">
                        <h3>Selected Rectangle:</h3>
                        <pre>{JSON.stringify(rectangleBounds, null, 2)}</pre>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
