// Domain types for the NTSA vehicle tracking portal

export type VehicleStatus = "online" | "expired" | "offline";

export interface TrackingPoint {
	id: string;
	timestamp: string; // ISO string, displayed as dd/mm/yyyy HH:mm:ss
	latitude: number;
	longitude: number;
	status: VehicleStatus;
	speed: number; // km/h
}

/** Shared shape used by the Map component and fleet marker list */
export interface MapMarker {
	id: string;
	latitude: number;
	longitude: number;
	status: VehicleStatus;
	label?: string;
}

export interface Vehicle {
	registration: string;
	make: string;
	model: string;
	yearOfManufacture: number;
	chassisNo: string;
	engineNo: string;
	deviceModel: string;
	deviceSerial: string;
	deviceSim: string;
	latitude: number;
	longitude: number;
	fittingDate: string;
	fittingAgent: string;
}

export interface Driver {
	firstName: string;
	middleName: string;
	lastName: string;
	home: string;
	email: string;
	phone: string;
}

export interface TrackedVehicle {
	vehicle: Vehicle;
	driver: Driver;
	history: TrackingPoint[];
}
