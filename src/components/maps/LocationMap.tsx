import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for missing default icon in Leaflet
const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface LocationMapProps {
    latitude: number;
    longitude: number;
    displayName?: string;
}

const LocationMap = ({ latitude, longitude, displayName }: LocationMapProps) => {
    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-slate-200 z-0">
            <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]} icon={icon}>
                    <Popup>
                        {displayName || "Borrower Location"}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationMap;
