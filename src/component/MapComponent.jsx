import L from 'leaflet';
import { Hexagon, Circle, PencilLine, Square } from 'lucide-react';
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
    const [missions, setMissions] = useState([])
    
    
    useEffect(() => {
        // Back-end
        fetch("http://localhost:5001/api/missions")
        .then((response) => response.json())
        .then((data) => {
            setMissions(data);
            console.log(data);
        })
        .catch((error) => console.error("Error", error));

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

    // Fungsi untuk menggambar persegi panjang
    const handleDrawRectangle = () => {
        const drawRectangle = new L.Draw.Rectangle(mapInstance.current, {
            shapeOptions: {
                color: 'green',
                weight: 2,
                fillColor: '#66ff66',
                fillOpacity: 0.4,
            }
        });
        drawRectangle.enable();
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


    return (
        <div className='relative flex items-center'>
            {/* Create Mission Button */}
            <div className='absolute w-full h-screen bg-transparent'>
                    <MenuComponent/>
            </div>
            
            {/* Container untuk peta */}
            <div ref={mapRef} className="w-screen h-screen mt-16 z-0" style={{ width: "100%", height: "calc(100vh - 4rem)" }} />


            <div className='absolute left-0 top-60 lg:top-56 flex items-start z-10'>
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
                    <button onClick={handleDrawRectangle} className="border-2 border-white px-2 py-2 bg-blue-950 text-white rounded-xl">
                        <Square />
                    </button>
                    {/* Tombol Kustom untuk Memulai Mode Gambar */}
                    <button onClick={handleDrawCircle} className="border-2 border-white px-2 py-2 bg-blue-950 text-white rounded-xl">
                        <Circle />
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
