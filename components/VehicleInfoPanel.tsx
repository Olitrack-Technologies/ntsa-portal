/**
 * VehicleInfoPanel — fixed right-side panel.
 * Displays user header, vehicle basic info, and driver information.
 */
import Image from "next/image";
import { Avatar, TextInput } from "@mantine/core";
import { IconSearch, IconLogout } from "@tabler/icons-react";
import type { Vehicle, Driver } from "@/types/vehicle";

// --- Sub-components ---------------------------------------------------------

interface InfoFieldProps {
	label: string;
	value: string | number;
}

/** Single label + value cell used in the info grids */
function InfoField({ label, value }: InfoFieldProps) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
				{label}
			</span>
			<span className="text-xs font-semibold text-gray-800 break-all">
				{value}
			</span>
		</div>
	);
}

interface SectionProps {
	title: string;
	children: React.ReactNode;
}

/** Collapsible-free section with a hairline title separator */
function Section({ title, children }: SectionProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
					{title}
				</span>
				<hr className="flex-1 border-gray-200" />
			</div>
			{children}
		</div>
	);
}

// --- Component --------------------------------------------------------------

interface VehicleInfoPanelProps {
	vehicle: Vehicle;
	driver: Driver;
	onSignOut: () => void;
	width?: number;
}

export default function VehicleInfoPanel({
	vehicle,
	driver,
	onSignOut,
	width
}: VehicleInfoPanelProps) {
	const cols =
		!width || width >= 400
			? "grid-cols-3"
			: width >= 270
				? "grid-cols-2"
				: "grid-cols-1";

	return (
		<aside className="flex flex-col h-full w-full bg-white border-l border-gray-200">
			{/* ── Search + Sign Out ───────────────────────────────────────────── */}
			<div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
				<TextInput
					variant="filled"
					placeholder="Search vehicle"
					leftSection={<IconSearch size={14} />}
					size="sm"
					className="flex-1"
				/>
			</div>

			{/* ── Scrollable body ─────────────────────────────────────────────── */}
			<div className="flex-1 overflow-y-auto px-4 py-4 flex space-y-4 flex-col gap-6">
				{/* Basic Information */}
				<Section title="Vehicle Information">
					<div className={`grid ${cols} gap-x-3 gap-y-4`}>
						<InfoField label="Vehicle Reg." value={vehicle.registration} />
						<InfoField label="Vehicle Make" value={vehicle.make} />
						<InfoField label="Vehicle Model" value={vehicle.model} />
						<InfoField
							label="Year of Manuf."
							value={vehicle.yearOfManufacture}
						/>
						<InfoField label="Chassis No." value={vehicle.chassisNo} />
						<InfoField label="Engine No." value={vehicle.engineNo} />
					</div>
				</Section>

				<Section title="Device Information">
					<div className={`grid ${cols} gap-x-3 gap-y-4`}>
						<InfoField label="Device Model" value={vehicle.deviceModel} />
						<InfoField label="Device Serial" value={vehicle.deviceSerial} />
						<InfoField label="Device SIM" value={vehicle.deviceSim} />

						<InfoField label="Fitting Date" value={vehicle.fittingDate} />
						<InfoField label="Fitting Agent" value={vehicle.fittingAgent} />
					</div>
				</Section>

				{/* Driver Information */}
				<Section title="Driver Information">
					<div className={`grid ${cols} gap-x-3 gap-y-4`}>
						<InfoField label="First Name" value={driver.firstName} />
						<InfoField label="Middle Name" value={driver.middleName} />
						<InfoField label="Last Name" value={driver.lastName} />
						<InfoField label="Home" value={driver.home} />
						<InfoField label="Email" value={driver.email} />
						<InfoField label="Phone Number" value={driver.phone} />
					</div>
				</Section>
			</div>
		</aside>
	);
}
