import L, { popup } from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        [-7.773648529865574, 110.37838175455724],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      //add marker Gamaforce
      const marker = L.marker([-7.773648529865574, 110.37838175455724]).addTo(mapInstance.current);

      //add pop up Gamaforce
      marker.bindPopup("This is Gamaforce").openPopup();

      //custom icon
      const customIcon = L.icon({
        iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
      });
      
      // GMRT
      L.marker([-7.774554892963059, 110.37880465952519], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup("This is GMRT!")
        .openPopup();
    }
  }, []);
  return <div ref={mapRef} className="w.screen h-[550px]">MapComponent</div>;
};

export default MapComponent;