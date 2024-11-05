import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const MapComponent = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const drawControlRef = useRef(null);
    const [polygonPoints, setPolygonPoints] = useState([]);

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

            // Event listener untuk menangani poligon yang selesai digambar
            mapInstance.current.on(L.Draw.Event.CREATED, (event) => {
                const layer = event.layer;
                const points = layer.getLatLngs()[0].map((point) => [point.lat, point.lng]);
                setPolygonPoints(points);

                // Tambahkan poligon ke peta
                layer.addTo(mapInstance.current);
            });
        }
    };

    return (
        <div className='relative'>
            {/* Container untuk peta */}
            <div ref={mapRef} className="w-screen h-screen mt-16 z-0" style={{ width: "100%", height: "calc(100vh - 4rem)" }} />

            <div className=''>
                <div className=''>
                    {/* Tombol Kustom untuk Memulai Mode Gambar */}
                    <button onClick={handleDrawPolygon} style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '8px 16px', zIndex: 1000, backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Draw Polygon
                    </button>
                </div>

                {/* Menampilkan Titik Poligon */}
                <div className='' style={{ position: 'absolute', top: '3rem', left: '1rem', backgroundColor: 'white', padding: '8px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                    <h3>Selected Points:</h3>
                    <pre>{JSON.stringify(polygonPoints, null, 2)}</pre>
                </div>
            </div>
            
        </div>
    );
};

export default MapComponent;
