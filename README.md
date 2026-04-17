# NTSA Vehicle Tracking Portal

A web portal for the National Transport and Safety Authority (NTSA) to monitor GPS-tracked vehicles in real time. Built on Next.js (Pages Router) with Mantine UI, Tailwind CSS, TanStack Table, and React Leaflet.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (Pages Router) | 16 |
| UI components | Mantine Core + Hooks + Form | 9 |
| Styling | Tailwind CSS | 4 |
| Icons | Tabler Icons React | latest |
| Map | React Leaflet + Leaflet | 5 / 1.9 |
| Table | TanStack Table | 8 |
| Language | TypeScript | 5 |

---

## Project Structure

```
ntsa-portal-app/
├── components/
│   ├── Map.tsx             # Leaflet map, status-driven SVG vehicle markers
│   ├── TrackingTable.tsx   # TanStack Table v8 — sortable tracking history
│   └── VehicleInfoPanel.tsx # Right-side info panel (vehicle + driver)
├── data/
│   └── mock.ts             # Static mock data (swap for real API calls)
├── pages/
│   ├── _app.tsx            # MantineProvider + global CSS
│   ├── login.tsx           # /login — authentication form
│   └── index.tsx           # /     — dashboard (map + table + info panel)
├── public/
│   ├── logo.png            # Small World / NTSA brand logo
│   ├── green.svg           # Marker icon — Moving
│   ├── yellow.svg          # Marker icon — Idling
│   └── red.svg             # Marker icon — Parked
├── styles/
│   └── globals.css         # Tailwind + Leaflet CSS imports
└── types/
    └── vehicle.ts          # Shared TypeScript domain types
```

---

## Pages

### `/login`
- Vivid-blue full-viewport background
- Centred white card with logo, username, and password fields
- Mantine form validation with loading state
- Mock credentials: **username** `ntsa` / **password** `password`
- On success → redirects to `/`

### `/` (Dashboard)
- **Left pane** — Leaflet map (OpenStreetMap tiles) occupying all remaining height
  - Custom SVG vehicle markers coloured by status (green = Moving, yellow = Idling, red = Parked)
  - Clicking a marker pans the map and highlights the matching table row
- **Bottom of left pane** — TanStack tracking-history table (sortable columns)
  - Clicking a row flies the map to that coordinate
- **Right pane** — Scrollable vehicle info panel
  - Header with logo, user avatar, and sign-out control
  - Search input
  - Basic Information grid (registration, make/model, device, location, fitting details)
  - Driver Information grid (name, contact, home)

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login).

### Build for production

```bash
npm run build
npm start
```

---

## Replacing Mock Data

All mock data lives in [`data/mock.ts`](data/mock.ts). To wire up a real backend:

1. Remove the static exports from `mock.ts`.
2. In `pages/index.tsx`, replace the `mockTrackedVehicle` import with an `swr` / `react-query` hook that calls your API.
3. The component contracts (`Vehicle`, `Driver`, `TrackingPoint` in `types/vehicle.ts`) stay unchanged — only the data source changes.

---

## Map Markers

Marker icons are SVG vehicle silhouettes located in `/public`. Each icon is loaded as a Leaflet `divIcon` so no bundler configuration is needed. To swap icons, replace `green.svg`, `yellow.svg`, or `red.svg` in `/public` — the `createVehicleIcon` function in `Map.tsx` resolves them by status name automatically.

---

## Environment Variables

No environment variables are required for the development mock. For production, add:

```
NEXT_PUBLIC_API_BASE_URL=https://api.your-backend.com
```

and update the fetch calls in `data/` accordingly.

---

## License

Proprietary — Olitrack Systems Ltd.
