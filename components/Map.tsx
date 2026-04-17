/**
 * Map — client-only Leaflet map with status-driven SVG vehicle markers.
 * Imported via next/dynamic with ssr:false to avoid SSR window errors.
 */
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { RefObject } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import type { VehicleStatus, MapMarker } from "@/types/vehicle";

// --- Icon factory -----------------------------------------------------------

/** Returns a Leaflet divIcon using the status-coloured SVG from /public */
function createVehicleIcon(status: VehicleStatus): L.DivIcon {
	const src = `/markers/${status.toLowerCase()}.png`;
	return L.divIcon({
		className: "",
		html: `<img src="${src}" style="width:15px;height:33px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))" />`,
		iconSize: [22, 48],
		iconAnchor: [11, 48], // tip of the vehicle sits on the coordinate
		popupAnchor: [0, -50]
	});
}

// --- Re-centre helper -------------------------------------------------------

/** Smoothly pans the map whenever the focused coordinate changes */
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
	const map = useMap();
	const prev = useRef({ lat, lng });

	useEffect(() => {
		if (prev.current.lat !== lat || prev.current.lng !== lng) {
			map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
			prev.current = { lat, lng };
		}
	}, [lat, lng, map]);

	return null;
}

// --- Active-marker popup opener ---------------------------------------------

interface ActivePopupProps {
	markerId: string | undefined;
	markerRefs: RefObject<Record<string, LeafletMarker | null>>;
}

/**
 * Opens the popup for the active marker whenever activePointId changes.
 * Must live inside MapContainer to access the map context.
 */
function ActivePopup({ markerId, markerRefs }: ActivePopupProps) {
	useEffect(() => {
		if (!markerId) return;
		// Small delay lets FlyTo animation settle before opening popup
		const t = setTimeout(() => {
			markerRefs.current[markerId]?.openPopup();
		}, 300);
		return () => clearTimeout(t);
	}, [markerId, markerRefs]);

	return null;
}

// --- Component --------------------------------------------------------------

interface MapProps {
	markers: MapMarker[];
	centre: { lat: number; lng: number };
	/** ID of the active tracking point — auto-opens that marker's popup */
	activePointId?: string;
	onMarkerClick?: (id: string) => void;
}

export default function Map({
	markers,
	centre,
	activePointId,
	onMarkerClick
}: MapProps) {
	// Refs keyed by marker id so ActivePopup can open the correct popup
	const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

	return (
		<MapContainer
			center={[centre.lat, centre.lng]}
			zoom={13}
			className="h-full w-full"
			attributionControl={false}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="© OpenStreetMap contributors"
			/>

			<FlyTo lat={centre.lat} lng={centre.lng} />
			<ActivePopup markerId={activePointId} markerRefs={markerRefs} />

			{markers.map((m) => (
				<Marker
					key={m.id}
					position={[m.latitude, m.longitude]}
					icon={createVehicleIcon(m.status)}
					ref={(ref) => {
						markerRefs.current[m.id] = ref;
					}}
					eventHandlers={{ click: () => onMarkerClick?.(m.id) }}></Marker>
			))}
		</MapContainer>
	);
}
