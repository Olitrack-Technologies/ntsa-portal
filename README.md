# NTSA Vehicle Tracking Portal

A web portal for the National Transport and Safety Authority (NTSA) to monitor GPS-tracked vehicles. Operators can search for a vehicle, view its real-time position on a map, inspect its tracking history, and review vehicle and driver details — all from a single screen.

Built on **Next.js (Pages Router)** with **Mantine UI**, **Tailwind CSS v4**, **TanStack Table v8**, and **React Leaflet**.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js — Pages Router | 15 |
| UI components | Mantine Core + Form | 7 |
| Styling | Tailwind CSS | 4 |
| Icons | Tabler Icons React | latest |
| Map | React Leaflet + Leaflet | 5 / 1.9 |
| Table | TanStack Table | 8 |
| Language | TypeScript | 5 |
| Font | Eudoxus Sans (self-hosted) | — |

---

## Project Structure

```
ntsa-portal-app/
├── components/
│   ├── Map.tsx               # Client-only Leaflet map, single active marker
│   ├── TrackingTable.tsx     # TanStack Table — sortable tracking history
│   └── VehicleInfoPanel.tsx  # Resizable right panel (vehicle + driver info)
├── data/
│   └── mock.ts               # Static mock data — swap for real API
├── pages/
│   ├── _app.tsx              # MantineProvider + global theme
│   ├── _document.tsx         # Custom HTML document
│   ├── index.tsx             # / — main dashboard
│   └── login.tsx             # /login — authentication
├── public/
│   ├── fonts/
│   │   ├── EudoxusSans-Light.ttf
│   │   ├── EudoxusSans-Regular.ttf
│   │   └── EudoxusSans-Bold.ttf
│   ├── markers/
│   │   ├── online.png        # Map marker — Online
│   │   ├── offline.png       # Map marker — Offline
│   │   └── expired.png       # Map marker — Certificate expired
│   └── logo.png              # Brand logo
├── styles/
│   └── globals.css           # Tailwind + Leaflet CSS + Eudoxus font-face declarations
└── types/
    └── vehicle.ts            # Shared TypeScript domain types
```

---

## Pages

### `/login`

A split-panel authentication screen.

- **Left panel (desktop only)** — dark navy brand panel with decorative circles, a tagline, and a brief portal description.
- **Right panel** — logo, "Welcome back" heading, username + password fields (Mantine form with validation), and a teal "Sign in" button.
- Mock credentials: **username** `ntsa` / **password** `password`
- On success the user is redirected to `/`.
- Failed login surfaces an inline error on the password field.

### `/` (Dashboard)

A three-pane layout that fills the full viewport below a fixed header.

#### Header
- Brand logo on the left.
- Clickable user avatar on the right — opens a Mantine `Menu` dropdown showing the signed-in account name/email and a **Sign Out** option.

#### Left pane — Map + Tracking Table
- **Map** (React Leaflet, OpenStreetMap tiles) fills all available height.
  - Displays a **single marker** for the currently selected tracking point.
  - Marker colour reflects vehicle status: green (online), red (expired), orange (offline).
  - The map smoothly flies to the selected coordinate whenever the active point changes.
  - Clicking the marker opens a styled popup showing label, status dot, and lat/lng.
- A **drag handle** separates the map from the table — drag up or down to resize the table (min 80 px, max 600 px).
- **Tracking history table** (TanStack Table v8) sits below the drag handle.
  - Columns: Timestamp, Latitude, Longitude, Status, Speed (km/h).
  - Records are sorted newest-first by default.
  - Timestamp is rendered as `12th Apr 2025, 9:32:00 AM`.
  - Status column uses Mantine `Badge` components: green = Online, red = Certificate expired, orange = Offline.
  - Clicking a row selects it (highlighted in indigo) and flies the map to that coordinate.

#### Right pane — Vehicle Info Panel
- A **vertical drag handle** on its left edge lets users resize the panel (min 200 px, max 600 px).
- Content reflows as the panel width changes:
  - ≥ 400 px → 3-column info grid
  - 270–399 px → 2-column grid
  - < 270 px → single-column stacked layout
- **Search bar** at the top (UI only — wires to Traccar device search in production).
- **Vehicle Information** section: registration, make, model, year, chassis no., engine no.
- **Device Information** section: device model, serial, SIM, fitting date, fitting agent.
- **Driver Information** section: full name, home address, email, phone.

---

## Components

### `Map.tsx`

| Prop | Type | Description |
|---|---|---|
| `markers` | `MapMarker[]` | Array of markers to render (typically one) |
| `centre` | `{ lat, lng }` | Coordinate to centre/fly the map to |
| `activePointId` | `string?` | ID of the marker whose popup should open |
| `onMarkerClick` | `(id: string) => void` | Called when a marker is clicked |

- Uses `next/dynamic` with `ssr: false` — Leaflet requires `window` and cannot run server-side.
- `FlyTo` inner component listens for `centre` changes and calls `map.flyTo()` with a 1-second animation.
- `ActivePopup` opens the correct marker popup after a 300 ms delay (allowing the fly animation to settle).
- Marker icons are loaded from `/public/markers/{status}.png` via Leaflet `divIcon`.

### `TrackingTable.tsx`

| Prop | Type | Description |
|---|---|---|
| `data` | `TrackingPoint[]` | Full tracking history array |
| `activeRowId` | `string?` | ID of the row to highlight |
| `onRowSelect` | `(point: TrackingPoint) => void` | Called on row click |

- Wraps TanStack Table `useReactTable` with `getCoreRowModel` and `getSortedRowModel`.
- Data is sorted newest-first before being passed to the table.
- The Timestamp column has `enableSorting: false` (sorting by other columns is supported).
- Active row is highlighted with an indigo background (`bg-indigo-50`).

### `VehicleInfoPanel.tsx`

| Prop | Type | Description |
|---|---|---|
| `vehicle` | `Vehicle` | Vehicle record |
| `driver` | `Driver` | Driver record |
| `onSignOut` | `() => void` | Sign-out callback |
| `width` | `number?` | Current panel width in px — drives responsive grid columns |

- The `aside` is `w-full` so it fills whatever width its parent wrapper provides.
- Grid column count is derived from `width` at render time (no container-query dependency).

---

## Types (`types/vehicle.ts`)

```ts
type VehicleStatus = "online" | "expired" | "offline";

interface TrackingPoint {
  id: string;
  timestamp: string;   // ISO 8601
  latitude: number;
  longitude: number;
  status: VehicleStatus;
  speed: number;       // km/h
}

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  status: VehicleStatus;
  label?: string;
}

interface Vehicle { /* registration, make, model, year, chassis, engine, device, fitting */ }
interface Driver  { /* firstName, middleName, lastName, home, email, phone */ }
interface TrackedVehicle { vehicle: Vehicle; driver: Driver; history: TrackingPoint[]; }
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) and sign in with `ntsa` / `password`.

### Production build

```bash
npm run build
npm start
```

---

## Connecting to a Real Backend (Traccar)

All mock data lives in [`data/mock.ts`](data/mock.ts). To replace it with live Traccar data:

### Endpoints you need

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/session` | POST | Authenticate — returns a session cookie |
| `/api/devices?name={query}` | GET | Search devices by name → resolve to `deviceId` |
| `/api/positions?deviceId={id}` | GET | Fetch last known position for a device |
| `/api/socket` | WebSocket | Stream live position updates in real time |
| `/api/reports/route?deviceId={id}&from={iso}&to={iso}` | GET | Historical route for the tracking history table |

### Migration steps

1. Add your Traccar server URL to `.env.local`:
   ```
   NEXT_PUBLIC_TRACCAR_URL=https://your-traccar-host
   ```
2. Replace `mockTrackedVehicle` in `pages/index.tsx` with a hook that calls `/api/devices` and `/api/positions`.
3. Open a WebSocket to `/api/socket` and update `activePoint` state on each incoming position frame.
4. Feed `/api/reports/route` results into the `history` prop of `TrackingTable`.
5. The `Vehicle`, `Driver`, `TrackingPoint`, and `MapMarker` types in `types/vehicle.ts` define the shape your data layer must produce — only the source changes, not the components.

---

## Typography

Eudoxus Sans is self-hosted from `/public/fonts/` and declared in `styles/globals.css` via `@font-face` rules for weights 300, 400, and 700. It is set as `fontFamily` in both Tailwind's base layer and the Mantine theme, ensuring consistent typography across all UI elements.

---

## License

Proprietary — Olitrack Systems Ltd.
