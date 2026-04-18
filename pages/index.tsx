/**
 * / — Main dashboard: split-pane map + table (left) and vehicle info (right).
 * Map is loaded client-side only via next/dynamic — keeps Leaflet out of SSR.
 */
import type { GetServerSideProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useCallback, useRef } from "react";


import TrackingTable from "@/components/TrackingTable";
import VehicleInfoPanel from "@/components/VehicleInfoPanel";
import { mockTrackedVehicle } from "@/data/mock";
import Image from "next/image";
import { Avatar, Menu } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";

// Leaflet cannot run in Node — dynamic import keeps it client-side only
const Map = dynamic(() => import("@/components/Map"), { ssr: false });


// --- Component --------------------------------------------------------------

export default function DashboardPage() {
	const router = useRouter();
	const { vehicle, owner, history } = mockTrackedVehicle;

	// Most recent history entry — drives the marker position and status
	const latestPoint = history.reduce((a, b) =>
		new Date(b.timestamp) > new Date(a.timestamp) ? b : a
	);

	const [tableHeight, setTableHeight] = useState(220);
	const tableHeightRef = useRef(220);

	const [panelWidth, setPanelWidth] = useState(320);
	const panelWidthRef = useRef(320);

	const dragStartY = useRef<number | null>(null);
	const dragStartX = useRef<number | null>(null);

	const handleDragStart = useCallback((e: React.MouseEvent) => {
		dragStartY.current = e.clientY;
		const startH = tableHeightRef.current;

		const onMove = (ev: MouseEvent) => {
			if (dragStartY.current === null) return;
			const next = Math.max(80, Math.min(600, startH + (dragStartY.current - ev.clientY)));
			tableHeightRef.current = next;
			setTableHeight(next);
		};
		const onUp = () => {
			dragStartY.current = null;
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
	}, []);

	const handlePanelDragStart = useCallback((e: React.MouseEvent) => {
		dragStartX.current = e.clientX;
		const startW = panelWidthRef.current;

		const onMove = (ev: MouseEvent) => {
			if (dragStartX.current === null) return;
			const next = Math.max(200, Math.min(600, startW + (dragStartX.current - ev.clientX)));
			panelWidthRef.current = next;
			setPanelWidth(next);
		};
		const onUp = () => {
			dragStartX.current = null;
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
	}, []);


	return (
		<>
			<Head>
				<title>Dashboard — NTSA Portal</title>
			</Head>

			<div className="flex flex-col h-screen overflow-hidden">
				{/* ── Header ─────────────────────────────────────────────────────── */}
				<div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 shrink-0 bg-white">
					{/* Logo */}
					<Image
						src="/logo.png"
						alt="Small World logo"
						width={90}
						height={36}
						className="object-contain"
					/>

					{/* User identity — click to open menu */}
					<Menu position="bottom-end" withArrow shadow="md">
						<Menu.Target>
							<button className="flex items-center gap-2 rounded hover:bg-gray-100 px-2 py-1 transition-colors">
								<Avatar color="teal" radius="xl">
									NT
								</Avatar>
								<div className="text-left leading-tight">
									<p className="text-xs font-bold text-gray-800">NTSA</p>
									<p className="text-[10px] text-gray-500">portal@ntsa.go.ke</p>
								</div>
							</button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>Signed in as</Menu.Label>
							<Menu.Item leftSection={<IconUser size={14} />} disabled>
								<div className="leading-tight">
									<p className="text-xs font-semibold text-gray-800">NTSA</p>
									<p className="text-[10px] text-gray-500">portal@ntsa.go.ke</p>
								</div>
							</Menu.Item>
							<Menu.Divider />
							<Menu.Item
								color="red"
								leftSection={<IconLogout size={14} />}
								onClick={() => router.push("/login")}>
								Sign Out
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div>

				{/* Full-viewport flex row — outer container never scrolls */}
				<div className="flex flex-1 overflow-hidden bg-gray-100">
					{/* ── Left column: map + tracking table ─────────────────────── */}
					<div className="flex flex-col flex-1 min-w-0">
						{/* Map fills all remaining height above the table */}
						<div className="flex-1 min-h-0">
							<Map
								markers={[{
									id: latestPoint.id,
									latitude: latestPoint.latitude,
									longitude: latestPoint.longitude,
									status: latestPoint.status,
									label: vehicle.registration
								}]}
								centre={{
									lat: latestPoint.latitude,
									lng: latestPoint.longitude
								}}
							/>
						</div>

						{/* Drag handle */}
						<div
							className="h-2 shrink-0 cursor-ns-resize bg-gray-200 hover:bg-teal-400 transition-colors"
							onMouseDown={handleDragStart}
						/>

						{/* Tracking history table — resizable height */}
						<div
							className="shrink-0 overflow-hidden"
							style={{ height: tableHeight }}>
							<TrackingTable
								data={history}
							/>
						</div>
					</div>

					{/* Vertical drag handle */}
					<div
						className="w-2 shrink-0 cursor-ew-resize bg-gray-200 hover:bg-teal-400 transition-colors"
						onMouseDown={handlePanelDragStart}
					/>

					{/* ── Right column: vehicle & driver info ───────────────────── */}
					<div style={{ width: panelWidth }} className="shrink-0">
						<VehicleInfoPanel
							vehicle={vehicle}
							owner={owner}
							onSignOut={() => router.push("/login")}
							width={panelWidth}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

// In production: validate session here and redirect unauthenticated users
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};
